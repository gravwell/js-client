/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isEqual, isNull, isUndefined, uniqueId } from 'lodash';
import { BehaviorSubject, combineLatest, NEVER, Observable, of } from 'rxjs';
import {
	bufferCount,
	catchError,
	distinctUntilChanged,
	filter,
	map,
	skipUntil,
	startWith,
	switchMap,
	tap,
} from 'rxjs/operators';
import {
	ElementFilter,
	Query,
	RawRequestSearchDetailsMessageSent,
	RawRequestSearchEntriesWithinRangeMessageSent,
	RawRequestSearchStatsMessageSent,
	RawRequestSearchStatsWithinRangeMessageSent,
	RawResponseForSearchDetailsMessageReceived,
	RawResponseForSearchStatsMessageReceived,
	RawSearchMessageReceived,
	RawSearchMessageSent,
	SearchEntries,
	SearchFilter,
	SearchMessageCommands,
	SearchStats,
	SearchSubscription,
	toSearchEntries,
} from '~/models';
import { Percentage, RawJSON, toNumericID } from '~/value-objects';
import { APIContext, APISubscription } from '../../utils';
import { initiateSearch } from '../initiate-search';
import { makeModifyOneQuery } from '../modify-one-query';
import { makeSubscribeToOneRawSearch } from '../subscribe-to-one-raw-search';
import {
	countEntriesFromModules,
	filterMessageByCommand,
	getDefaultGranularityByRendererType,
	RequiredSearchFilter,
	SEARCH_FILTER_PREFIX,
} from './helpers';

export const makeSubscribeToOneSearch = (context: APIContext) => {
	const modifyOneQuery = makeModifyOneQuery(context);
	const subscribeToOneRawSearch = makeSubscribeToOneRawSearch(context);
	let rawSubscriptionP: ReturnType<typeof subscribeToOneRawSearch> | null = null;

	return async (
		query: Query,
		range: [Date, Date],
		options: { filter?: SearchFilter; metadata?: RawJSON; preview?: boolean } = {},
	): Promise<SearchSubscription> => {
		if (isNull(rawSubscriptionP)) rawSubscriptionP = subscribeToOneRawSearch();
		const rawSubscription = await rawSubscriptionP;

		const launchOneSearch = makeLaunchOneSearch(modifyOneQuery, rawSubscription);

		const firstSearch = await launchOneSearch(query, range, options);
		let currentSearch = firstSearch;
		const searchSub$ = new BehaviorSubject<Omit<SearchSubscription, 'relaunch'>>(firstSearch);

		const relaunch = async (relaunchOptions: { range?: [Date, Date]; filter?: SearchFilter } = {}): Promise<void> => {
			const filter = options.filter ?? relaunchOptions.filter;
			const newSearch = await launchOneSearch(query, relaunchOptions.range ?? range, { ...options, filter });
			currentSearch = newSearch;
			result.searchID = newSearch.searchID;
			searchSub$.next(newSearch);
		};

		const setFilter = (filter: Omit<SearchFilter, 'elementFilters'> | null): void => currentSearch.setFilter(filter);

		const progress$ = searchSub$.pipe(switchMap(searchSub => searchSub.progress$));
		const entries$ = searchSub$.pipe(switchMap(searchSub => searchSub.entries$));
		const errors$ = searchSub$.pipe(switchMap(searchSub => searchSub.errors$));
		const stats$ = searchSub$.pipe(switchMap(searchSub => searchSub.stats$));
		const statsOverview$ = searchSub$.pipe(switchMap(searchSub => searchSub.statsOverview$));
		const statsZoom$ = searchSub$.pipe(switchMap(searchSub => searchSub.statsZoom$));

		const result: SearchSubscription = {
			// Updated in relaunch()
			searchID: currentSearch.searchID,

			progress$,
			entries$,
			errors$,
			stats$,
			statsOverview$,
			statsZoom$,

			setFilter,
			relaunch,
		};
		return result;
	};
};

const makeLaunchOneSearch = (
	modifyOneQuery: (query: string, filters: Array<ElementFilter>) => Promise<string>,
	rawSubscription: APISubscription<RawSearchMessageReceived, RawSearchMessageSent>,
) => async (
	query: Query,
	range: [Date, Date],
	options: { filter?: SearchFilter; metadata?: RawJSON; preview?: boolean } = {},
): Promise<Omit<SearchSubscription, 'relaunch'>> => {
	const initialFilter = {
		entriesOffset: {
			index: options.filter?.entriesOffset?.index ?? 0,
			count: options.filter?.entriesOffset?.count ?? 100,
		},
		dateRange: {
			start: options.filter?.dateRange?.start ?? range[0],
			end: options.filter?.dateRange?.end ?? range[1],
		},
		// *NOTE: The default granularity is recalculated when we receive the renderer type
		desiredGranularity: options.filter?.desiredGranularity ?? 100,

		overviewGranularity: options.filter?.overviewGranularity ?? 90,

		zoomGranularity: options.filter?.zoomGranularity ?? 90,

		elementFilters: options.filter?.elementFilters ?? [],
	};
	const initialFilterID = uniqueId(SEARCH_FILTER_PREFIX);

	const filtersByID: Record<string, SearchFilter | undefined> = {};
	filtersByID[initialFilterID] = initialFilter;

	const modifiedQuery =
		initialFilter.elementFilters.length === 0 ? query : await modifyOneQuery(query, initialFilter.elementFilters);

	const searchInitMsg = await initiateSearch(rawSubscription, modifiedQuery, range, {
		initialFilterID,
		metadata: options.metadata,
		preview: options.preview,
	});
	const searchTypeID = searchInitMsg.data.OutputSearchSubproto;
	const isResponseError = filterMessageByCommand(SearchMessageCommands.ResponseError);
	const searchMessages$ = rawSubscription.received$.pipe(
		filter(msg => msg.type === searchTypeID),
		tap(msg => {
			// Throw if the search message command is Error
			if (isResponseError(msg)) {
				throw new Error(msg.data.Error);
			}
		}),
	);
	const rendererType = searchInitMsg.data.RenderModule;

	const progress$: Observable<Percentage> = searchMessages$.pipe(
		map(msg => (msg as Partial<RawResponseForSearchDetailsMessageReceived>).data?.Finished ?? null),
		filter(isBoolean),
		map(done => (done ? 1 : 0)),
		distinctUntilChanged(),
		map(rawPercentage => new Percentage(rawPercentage)),
	);

	const entries$: Observable<SearchEntries> = searchMessages$.pipe(
		filter(filterMessageByCommand(SearchMessageCommands.RequestEntriesWithinRange)),
		map(
			(msg): SearchEntries => {
				const base = toSearchEntries(rendererType, msg);
				const filterID = (msg.data.Addendum?.filterID as string | undefined) ?? null;
				const filter = filtersByID[filterID ?? ''] ?? undefined;
				return { ...base, filter } as SearchEntries;
			},
		),
		tap(entries => {
			const defDesiredGranularity = getDefaultGranularityByRendererType(entries.type);
			initialFilter.desiredGranularity = defDesiredGranularity;
		}),
	);

	const _filter$ = new BehaviorSubject<SearchFilter>(initialFilter);
	const setFilter = (filter: SearchFilter | null) => {
		_filter$.next(filter ?? initialFilter);
	};
	const filter$ = _filter$.asObservable().pipe(
		startWith<SearchFilter>(initialFilter),
		bufferCount(2, 1),
		map(
			([prev, curr]): RequiredSearchFilter => ({
				entriesOffset: {
					index: curr.entriesOffset?.index ?? prev.entriesOffset?.index ?? initialFilter.entriesOffset.index,
					count: curr.entriesOffset?.count ?? prev.entriesOffset?.count ?? initialFilter.entriesOffset.count,
				},
				dateRange: {
					start: curr.dateRange?.start ?? prev.dateRange?.start ?? initialFilter.dateRange.start,
					end: curr.dateRange?.end ?? prev.dateRange?.end ?? initialFilter.dateRange.end,
				},
				desiredGranularity: curr.desiredGranularity ?? prev.desiredGranularity ?? initialFilter.desiredGranularity,
				overviewGranularity: curr.overviewGranularity ?? prev.overviewGranularity ?? initialFilter.overviewGranularity,
				zoomGranularity: curr.zoomGranularity ?? prev.zoomGranularity ?? initialFilter.zoomGranularity,
				elementFilters: initialFilter.elementFilters,
			}),
		),
		distinctUntilChanged((a, b) => isEqual(a, b)),
	);

	const requestEntries = async (filter: RequiredSearchFilter): Promise<void> => {
		const filterID = uniqueId(SEARCH_FILTER_PREFIX);
		filtersByID[filterID] = filter;

		const first = filter.entriesOffset.index;
		const last = first + filter.entriesOffset.count;
		const start = filter.dateRange.start.toISOString();
		const end = filter.dateRange.end.toISOString();
		// TODO: Filter by .desiredGranularity and .fieldFilters

		const requestEntriesMsg: RawRequestSearchEntriesWithinRangeMessageSent = {
			type: searchTypeID,
			data: {
				ID: SearchMessageCommands.RequestEntriesWithinRange,
				Addendum: { filterID },
				EntryRange: {
					First: first,
					Last: last,
					StartTS: start,
					EndTS: end,
				},
			},
		};
		const entriesP = rawSubscription.send(requestEntriesMsg);

		const requestStatsMessage: RawRequestSearchStatsMessageSent = {
			type: searchTypeID,
			data: {
				ID: SearchMessageCommands.RequestAllStats,
				Addendum: { filterID },
				Stats: { SetCount: filter.overviewGranularity },
			},
		};
		const statsP = rawSubscription.send(requestStatsMessage);

		const requestDetailsMsg: RawRequestSearchDetailsMessageSent = {
			type: searchTypeID,
			data: { ID: SearchMessageCommands.RequestDetails, Addendum: { filterID } },
		};
		const detailsP = rawSubscription.send(requestDetailsMsg);

		const requestStatsWithinRangeMsg: RawRequestSearchStatsWithinRangeMessageSent = {
			type: searchTypeID,
			data: {
				ID: SearchMessageCommands.RequestStatsInRange,
				Addendum: { filterID },
				Stats: {
					SetCount: filter.zoomGranularity,
					SetEnd: end,
					SetStart: start,
				},
			},
		};
		const statsRangeP = rawSubscription.send(requestStatsWithinRangeMsg);

		await Promise.all([entriesP, statsP, detailsP, statsRangeP]);
	};

	filter$.subscribe(filter => {
		requestEntries(filter);
		setTimeout(() => requestEntries(filter), 2000); // TODO: Change this
	});

	const rawSearchStats$ = searchMessages$.pipe(filter(filterMessageByCommand(SearchMessageCommands.RequestAllStats)));

	const rawSearchDetails$ = searchMessages$.pipe(filter(filterMessageByCommand(SearchMessageCommands.RequestDetails)));

	const rawStatsZoom$ = searchMessages$.pipe(filter(filterMessageByCommand(SearchMessageCommands.RequestStatsInRange)));

	const stats$ = combineLatest(rawSearchStats$, rawSearchDetails$).pipe(
		map(
			([rawStats, rawDetails]): SearchStats => {
				const filterID =
					(rawStats.data.Addendum?.filterID as string | undefined) ??
					(rawDetails.data.Addendum?.filterID as string | undefined) ??
					null;
				const filter = filtersByID[filterID ?? ''] ?? undefined;

				const pipeline = rawStats.data.Stats.Set.map(s => s.Stats)
					.reduce<
						Array<Array<RawResponseForSearchStatsMessageReceived['data']['Stats']['Set'][number]['Stats'][number]>>
					>((acc, curr) => {
						curr.forEach((_curr, i) => {
							if (isUndefined(acc[i])) acc[i] = [];
							acc[i].push(_curr);
						});
						return acc;
					}, [])
					.map(s =>
						s
							.map(_s => ({
								module: _s.Name,
								arguments: _s.Args,
								duration: _s.Duration,
								input: {
									bytes: _s.InputBytes,
									entries: _s.InputCount,
								},
								output: {
									bytes: _s.OutputBytes,
									entries: _s.OutputCount,
								},
							}))
							.reduce((acc, curr) => ({
								...curr,
								duration: acc.duration + curr.duration,
								input: {
									bytes: acc.input.bytes + curr.input.bytes,
									entries: acc.input.entries + curr.input.entries,
								},
								output: {
									bytes: acc.output.bytes + curr.output.bytes,
									entries: acc.output.entries + curr.output.entries,
								},
							})),
					);

				return {
					id: rawDetails.data.SearchInfo.ID,
					userID: toNumericID(rawDetails.data.SearchInfo.UID),

					filter,
					finished: rawStats.data.Finished && rawDetails.data.Finished,

					query: searchInitMsg.data.RawQuery,
					effectiveQuery: searchInitMsg.data.SearchString,

					metadata: searchInitMsg.data.Metadata,
					entries: rawStats.data.EntryCount,
					duration: rawDetails.data.SearchInfo.Duration,
					start: new Date(rawDetails.data.SearchInfo.StartRange),
					end: new Date(rawDetails.data.SearchInfo.EndRange),
					minZoomWindow: rawDetails.data.SearchInfo.MinZoomWindow,
					downloadFormats: rawDetails.data.SearchInfo.RenderDownloadFormats,
					tags: searchInitMsg.data.Tags,

					storeSize: rawDetails.data.SearchInfo.StoreSize,
					processed: {
						entries: pipeline[0]?.input?.entries ?? 0,
						bytes: pipeline[0]?.input?.bytes ?? 0,
					},

					pipeline,
				};
			},
		),
	);

	const statsOverview$ = rawSearchStats$.pipe(
		map(set => {
			return { frequencyStats: countEntriesFromModules(set) };
		}),
	);

	const statsZoom$ = rawStatsZoom$.pipe(
		map(set => {
			const filterID = (set.data.Addendum?.filterID as string | undefined) ?? null;
			const filter = filtersByID[filterID ?? ''] ?? undefined;
			return { frequencyStats: countEntriesFromModules(set), filter };
		}),
	);

	const errors$: Observable<Error> = searchMessages$.pipe(
		// Skip every regular message. We only want to emit when there's an error
		skipUntil(NEVER),

		// When there's an error, catch it and emit it
		catchError(err => of(err)),
	);

	return {
		progress$,
		entries$,
		stats$,
		statsOverview$,
		statsZoom$,
		errors$,
		setFilter,
		searchID: searchInitMsg.data.SearchID.toString(),
	};
};
