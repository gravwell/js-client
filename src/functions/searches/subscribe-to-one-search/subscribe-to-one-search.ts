/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isEqual, isNil, isNull, isUndefined, last, uniqueId } from 'lodash';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { bufferCount, distinctUntilChanged, filter, map, startWith, tap } from 'rxjs/operators';
import {
	Query,
	RawRequestSearchDetailsMessageSent,
	RawRequestSearchEntriesWithinRangeMessageSent,
	RawRequestSearchStatsMessageSent,
	RawRequestSearchStatsWithinRangeMessageSent,
	RawResponseForSearchDetailsMessageReceived,
	RawResponseForSearchStatsMessageReceived,
	RawResponseForSearchStatsWithinRangeMessageReceived,
	RawSearchMessageReceivedRequestEntriesWithinRange,
	SearchEntries,
	SearchFilter,
	SearchFrequencyStats,
	SearchMessageCommands,
	SearchStats,
	SearchSubscription,
	toSearchEntries,
} from '~/models';
import { Percentage, RawJSON, toNumericID } from '~/value-objects';
import { APIContext } from '../../utils';
import { initiateSearch } from '../initiate-search';
import { makeSubscribeToOneRawSearch } from '../subscribe-to-one-raw-search';

type RequiredSearchFilter = Required<
	Omit<SearchFilter, 'dateRange'> & { dateRange: Required<NonNullable<SearchFilter['dateRange']>> }
>;

const countEntriesFromModules = (
	msg: RawResponseForSearchStatsMessageReceived | RawResponseForSearchStatsWithinRangeMessageReceived,
): Array<SearchFrequencyStats> => {
	const statsSet = msg.data.Stats.Set;
	return statsSet.map(set => ({
		timestamp: new Date(set.TS),
		count: last(set.Stats)?.OutputCount ?? 0,
	}));
};

const SEARCH_FILTER_PREFIX = 'search-filter-';

export const makeSubscribeToOneSearch = (context: APIContext) => {
	const subscribeToOneRawSearch = makeSubscribeToOneRawSearch(context);
	let rawSubscriptionP: ReturnType<typeof subscribeToOneRawSearch> | null = null;

	return async (
		query: Query,
		range: [Date, Date],
		options: { filter?: SearchFilter; metadata?: RawJSON } = {},
	): Promise<SearchSubscription> => {
		if (isNull(rawSubscriptionP)) rawSubscriptionP = subscribeToOneRawSearch();
		const rawSubscription = await rawSubscriptionP;

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
		};
		const initialFilterID = uniqueId(SEARCH_FILTER_PREFIX);

		const filtersByID: Record<string, SearchFilter | undefined> = {};
		filtersByID[initialFilterID] = initialFilter;

		const searchInitMsg = await initiateSearch(rawSubscription, query, range, {
			initialFilterID,
			metadata: options.metadata,
		});
		const searchTypeID = searchInitMsg.data.OutputSearchSubproto;
		const searchMessages$ = rawSubscription.received$.pipe(filter(msg => msg.type === searchTypeID));
		const rendererType = searchInitMsg.data.RenderModule;

		const progress$: Observable<Percentage> = searchMessages$.pipe(
			map(msg => (msg as Partial<RawResponseForSearchDetailsMessageReceived>).data?.Finished ?? null),
			filter(isBoolean),
			map(done => (done ? 1 : 0)),
			distinctUntilChanged(),
			map(rawPercentage => new Percentage(rawPercentage)),
		);

		const entries$: Observable<SearchEntries> = searchMessages$.pipe(
			filter((msg): msg is RawSearchMessageReceivedRequestEntriesWithinRange => {
				try {
					const _msg = <RawSearchMessageReceivedRequestEntriesWithinRange>msg;
					return _msg.data.ID === SearchMessageCommands.RequestEntriesWithinRange;
				} catch {
					return false;
				}
			}),
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
					overviewGranularity:
						curr.overviewGranularity ?? prev.overviewGranularity ?? initialFilter.overviewGranularity,
					zoomGranularity: curr.zoomGranularity ?? prev.zoomGranularity ?? initialFilter.zoomGranularity,
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

		const rawSearchStats$ = searchMessages$.pipe(
			filter((msg): msg is RawResponseForSearchStatsMessageReceived => {
				try {
					const _msg = <RawResponseForSearchStatsMessageReceived>msg;
					return _msg.data.ID === SearchMessageCommands.RequestAllStats;
				} catch {
					return false;
				}
			}),
		);

		const rawSearchDetails$ = searchMessages$.pipe(
			filter((msg): msg is RawResponseForSearchDetailsMessageReceived => {
				try {
					const _msg = <RawResponseForSearchDetailsMessageReceived>msg;
					return _msg.data.ID === SearchMessageCommands.RequestDetails;
				} catch {
					return false;
				}
			}),
		);

		const rawStatsZoom$ = searchMessages$.pipe(
			filter((msg): msg is RawResponseForSearchStatsWithinRangeMessageReceived => {
				try {
					const _msg = <RawResponseForSearchStatsWithinRangeMessageReceived>msg;
					return _msg.data.ID === SearchMessageCommands.RequestStatsInRange;
				} catch {
					return false;
				}
			}),
		);

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

		return {
			progress$,
			entries$,
			stats$,
			statsOverview$,
			statsZoom$,
			setFilter,
			searchID: searchInitMsg.data.SearchID.toString(),
		};
	};
};

const DEFAULT_GRANULARITY_MAP: Record<SearchEntries['type'], number> = {
	'chart': 160,
	'fdg': 2000,
	'gauge': 100, // *NOTE: Couldn't find it in environments.ts, using the same as table
	'heatmap': 10000,
	'point to point': 1000, // *NOTE: Couldn't find it in environments.ts, using the same as pointmap
	'pointmap': 1000,
	'raw': 50,
	'text': 50,
	'stack graph': 150,
	'table': 100,
};

const getDefaultGranularityByRendererType = (rendererType: SearchEntries['type']): number => {
	const v = DEFAULT_GRANULARITY_MAP[rendererType];
	if (isNil(v)) {
		console.log(`Unknown renderer ${rendererType}, will use 100 as the default granularity`);
		return 100;
	}
	return v;
};
