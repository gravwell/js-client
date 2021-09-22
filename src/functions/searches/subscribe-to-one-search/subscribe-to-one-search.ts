/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isAfter, subHours } from 'date-fns';
import { isBoolean, isNil, isNull, isUndefined, uniqueId } from 'lodash';
import { BehaviorSubject, combineLatest, EMPTY, from, NEVER, Observable, of, Subject, Subscription } from 'rxjs';
import {
	bufferCount,
	catchError,
	concatMap,
	debounceTime,
	delayWhen,
	distinctUntilChanged,
	filter,
	filter as rxjsFilter,
	first,
	map,
	skipUntil,
	startWith,
	takeUntil,
	tap,
} from 'rxjs/operators';
import {
	Query,
	RawRequestSearchCloseMessageSent,
	RawRequestSearchDetailsMessageSent,
	RawRequestSearchEntriesWithinRangeMessageSent,
	RawRequestSearchStatsMessageSent,
	RawRequestSearchStatsWithinRangeMessageSent,
	RawResponseForSearchDetailsMessageReceived,
	RawResponseForSearchStatsMessageReceived,
	SearchEntries,
	SearchFilter,
	SearchMessageCommands,
	SearchStats,
	SearchSubscription,
	toSearchEntries,
} from '~/models';
import { Percentage, RawJSON, toNumericID } from '~/value-objects';
import { APIContext, DelayHandlerProps, initDynamicDelay } from '../../utils';
import { initiateSearch } from '../initiate-search';
import { makeModifyOneQuery } from '../modify-one-query';
import { makeSubscribeToOneRawSearch } from '../subscribe-to-one-raw-search';
import {
	countEntriesFromModules,
	filterMessageByCommand,
	getDefaultGranularityByRendererType,
	recalculateZoomEnd,
	RequiredSearchFilter,
	SEARCH_FILTER_PREFIX,
} from './helpers';

export const makeSubscribeToOneSearch = (context: APIContext) => {
	const modifyOneQuery = makeModifyOneQuery(context);
	const subscribeToOneRawSearch = makeSubscribeToOneRawSearch(context);
	let rawSubscriptionP: ReturnType<typeof subscribeToOneRawSearch> | null = null;
	let closedSub: Subscription | null = null;

	// * search interval settings
	const dynamicDelayProps = {
		stepSizeValue: 500, //0.5 sec // * time do add after each search
		offsetValue: 4000, //4 sec // * not pass this time
		initialValue: 1000, // 1s // * await with this value at first call
	} as DelayHandlerProps;
	//initialize dynamicDelay operator
	const dynamicDelay = initDynamicDelay(dynamicDelayProps);

	return async (
		query: Query,
		options: { filter?: SearchFilter; metadata?: RawJSON; noHistory?: boolean } = {},
	): Promise<SearchSubscription> => {
		if (isNull(rawSubscriptionP)) {
			rawSubscriptionP = subscribeToOneRawSearch();
			if (closedSub?.closed === false) {
				closedSub.unsubscribe();
			}

			// Handles websocket hangups
			closedSub = from(rawSubscriptionP)
				.pipe(concatMap(rawSubscription => rawSubscription.received$))
				.subscribe({
					complete: () => {
						rawSubscriptionP = null;
					},
				});
		}
		const rawSubscription = await rawSubscriptionP;

		// The default end date is now
		const defaultEnd = new Date();

		// The default start date is one hour ago
		const defaultStart = subHours(defaultEnd, 1);

		let closed = false;
		const close$ = new Subject<void>();

		const initialFilter = {
			entriesOffset: {
				index: options.filter?.entriesOffset?.index ?? 0,
				count: options.filter?.entriesOffset?.count ?? 100,
			},
			dateRange:
				options.filter?.dateRange === 'preview'
					? ('preview' as const)
					: {
							start: options.filter?.dateRange?.start ?? defaultStart,
							end: options.filter?.dateRange?.end ?? defaultEnd,
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

		const searchInitMsg = await initiateSearch(rawSubscription, modifiedQuery, {
			initialFilterID,
			metadata: options.metadata,
			range:
				initialFilter.dateRange === 'preview'
					? 'preview'
					: [initialFilter.dateRange.start, initialFilter.dateRange.end],
			noHistory: options.noHistory,
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

				// Listen for close messages and emit on close$
				const isCloseMsg = filterMessageByCommand(SearchMessageCommands.Close);
				if (isCloseMsg(msg)) {
					close$.next();
					close$.complete();
					closed = true;
				}
			}),
			// Complete when/if the user calls .close()
			takeUntil(close$),
		);
		const rendererType = searchInitMsg.data.RenderModule;

		type DateRange = { start: Date; end: Date };
		const previewDateRange: DateRange = await (async (): Promise<DateRange> => {
			// Not in preview mode, so return the initial filter date range, whatever, it won't be used
			if (initialFilter.dateRange !== 'preview') return initialFilter.dateRange;

			// In preview mode, so we need to request search details and use the timerange that we get back
			const detailsP = searchMessages$
				.pipe(filter(filterMessageByCommand(SearchMessageCommands.RequestDetails)), first())
				.toPromise();
			const requestDetailsMsg: RawRequestSearchDetailsMessageSent = {
				type: searchTypeID,
				data: { ID: SearchMessageCommands.RequestDetails },
			};
			rawSubscription.send(requestDetailsMsg);
			const details = await detailsP;

			return {
				start: new Date(details.data.SearchInfo.StartRange),
				end: new Date(details.data.SearchInfo.EndRange),
			};
		})();

		const close = async (): Promise<void> => {
			if (closed) return undefined;

			const closeMsg: RawRequestSearchCloseMessageSent = {
				type: searchTypeID,
				data: { ID: SearchMessageCommands.Close },
			};
			await rawSubscription.send(closeMsg);

			// Wait for closed message to be received
			await close$.toPromise();
		};

		const progress$: Observable<Percentage> = searchMessages$.pipe(
			//add delay time after each search
			delayWhen(dynamicDelay),

			map(msg => (msg as Partial<RawResponseForSearchDetailsMessageReceived>).data?.Finished ?? null),
			filter(isBoolean),
			map(done => (done ? 1 : 0)),
			distinctUntilChanged(),
			map(rawPercentage => new Percentage(rawPercentage)),
			// Complete when/if the user calls .close()
			takeUntil(close$),
		);

		const entries$: Observable<SearchEntries> = searchMessages$.pipe(
			//add delay time after each search
			delayWhen(dynamicDelay),

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
			// Complete when/if the user calls .close()
			takeUntil(close$),
		);

		const expandDateRange = (dateRange: SearchFilter['dateRange']): Partial<DateRange> => {
			if (dateRange === 'preview') return previewDateRange;
			return dateRange ?? {};
		};

		const _filter$ = new BehaviorSubject<SearchFilter>(initialFilter);
		const setFilter = (filter: SearchFilter | null): void => {
			if (closed) return undefined;
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
						start: defaultStart,
						end: defaultEnd,
						...expandDateRange(initialFilter.dateRange),
						...expandDateRange(prev.dateRange),
						...expandDateRange(curr.dateRange),
					},
					desiredGranularity: curr.desiredGranularity ?? prev.desiredGranularity ?? initialFilter.desiredGranularity,
					overviewGranularity:
						curr.overviewGranularity ?? prev.overviewGranularity ?? initialFilter.overviewGranularity,
					zoomGranularity: curr.zoomGranularity ?? prev.zoomGranularity ?? initialFilter.zoomGranularity,
					elementFilters: initialFilter.elementFilters,
				}),
			),

			// Complete when/if the user calls .close()
			takeUntil(close$),
		);

		const nextDetailsMsg = () =>
			searchMessages$
				.pipe(
					filter(filterMessageByCommand(SearchMessageCommands.RequestDetails)),
					first(),
					// cleanup: Complete when/if the user calls .close()
					takeUntil(close$),
				)
				.toPromise();

		let pollingSubs: Subscription;

		const requestEntries = async (filter: RequiredSearchFilter): Promise<void> => {
			if (closed) return undefined;

			if (!isNil(pollingSubs)) {
				pollingSubs.unsubscribe();
			}
			pollingSubs = new Subscription();

			const filterID = uniqueId(SEARCH_FILTER_PREFIX);
			filtersByID[filterID] = filter;

			const first = filter.entriesOffset.index;
			const last = first + filter.entriesOffset.count;
			const startDate = filter.dateRange === 'preview' ? previewDateRange.start : filter.dateRange.start;
			const start = startDate.toISOString();
			const endDate = filter.dateRange === 'preview' ? previewDateRange.end : filter.dateRange.end;
			const end = endDate.toISOString();
			// TODO: Filter by .desiredGranularity and .fieldFilters

			// Set up a promise to wait for the next details message
			const detailsMsgP = nextDetailsMsg();
			// Send a request for details
			const requestDetailsMsg: RawRequestSearchDetailsMessageSent = {
				type: searchTypeID,
				data: { ID: SearchMessageCommands.RequestDetails, Addendum: { filterID } },
			};
			const detailsP = rawSubscription.send(requestDetailsMsg);

			// Grab the results from the details response (we need it later)
			const detailsResults = await Promise.all([detailsP, detailsMsgP]);
			const detailsMsg = detailsResults[1];

			// Keep sending requests for search details until Finished is true
			pollingSubs.add(
				rawSearchDetails$
					.pipe(
						startWith(detailsMsg), // We've already received one details message - use it to start
						rxjsFilter(details => !details.data.Finished),
						debounceTime(500),
						concatMap(() => rawSubscription.send(requestDetailsMsg)),
						catchError(() => EMPTY),
						takeUntil(close$),
					)
					.subscribe(),
			);

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
			// Keep sending requests for entries until finished is true
			pollingSubs.add(
				entries$
					.pipe(
						rxjsFilter(entries => !entries.finished),
						debounceTime(500),
						concatMap(() => rawSubscription.send(requestEntriesMsg)),
						catchError(() => EMPTY),
						takeUntil(close$),
					)
					.subscribe(),
			);
			const entriesP = rawSubscription.send(requestEntriesMsg);

			const requestStatsMessage: RawRequestSearchStatsMessageSent = {
				type: searchTypeID,
				data: {
					ID: SearchMessageCommands.RequestAllStats,
					Addendum: { filterID },
					Stats: { SetCount: filter.overviewGranularity },
				},
			};
			// Keep sending requests for stats until finished is true
			pollingSubs.add(
				rawSearchStats$
					.pipe(
						rxjsFilter(stats => !stats.data.Finished),
						debounceTime(500),
						concatMap(() => rawSubscription.send(requestStatsMessage)),
						catchError(() => EMPTY),
						takeUntil(close$),
					)
					.subscribe(),
			);
			const statsP = rawSubscription.send(requestStatsMessage);

			const requestStatsWithinRangeMsg: RawRequestSearchStatsWithinRangeMessageSent = {
				type: searchTypeID,
				data: {
					ID: SearchMessageCommands.RequestStatsInRange,
					Addendum: { filterID },
					Stats: {
						SetCount: filter.zoomGranularity,
						SetEnd: recalculateZoomEnd(
							detailsMsg.data.SearchInfo.MinZoomWindow,
							filter.zoomGranularity,
							startDate,
							endDate,
						).toISOString(),
						SetStart: start,
					},
				},
			};
			// Keep sending requests for stats-within-range until finished is true
			pollingSubs.add(
				rawStatsZoom$
					.pipe(
						rxjsFilter(stats => !stats.data.Finished),
						debounceTime(500),
						concatMap(() => rawSubscription.send(requestStatsWithinRangeMsg)),
						catchError(() => EMPTY),
						takeUntil(close$),
					)
					.subscribe(),
			);
			const statsRangeP = rawSubscription.send(requestStatsWithinRangeMsg);

			await Promise.all([entriesP, statsP, detailsP, statsRangeP]);
		};

		filter$.subscribe(filter => {
			requestEntries(filter);
		});

		const rawSearchStats$ = searchMessages$.pipe(
			//add delay time after each search
			delayWhen(dynamicDelay),

			filter(filterMessageByCommand(SearchMessageCommands.RequestAllStats)),

			// Complete when/if the user calls .close()
			takeUntil(close$),
		);

		const rawSearchDetails$ = searchMessages$.pipe(
			//add delay time after each search
			delayWhen(dynamicDelay),

			filter(filterMessageByCommand(SearchMessageCommands.RequestDetails)),

			// Complete when/if the user calls .close()
			takeUntil(close$),
		);

		const rawStatsZoom$ = searchMessages$.pipe(
			//add delay time after each search
			delayWhen(dynamicDelay),

			filter(filterMessageByCommand(SearchMessageCommands.RequestStatsInRange)),

			// Complete when/if the user calls .close()
			takeUntil(close$),
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
			// Complete when/if the user calls .close()
			takeUntil(close$),
		);

		const statsOverview$ = rawSearchStats$.pipe(
			map(set => {
				return { frequencyStats: countEntriesFromModules(set) };
			}),

			// Complete when/if the user calls .close()
			takeUntil(close$),
		);

		const statsZoom$ = rawStatsZoom$.pipe(
			map(set => {
				const filterID = (set.data.Addendum?.filterID as string | undefined) ?? null;
				const filter = filtersByID[filterID ?? ''] ?? undefined;

				const filterEnd = filter?.dateRange === 'preview' ? previewDateRange.end : filter?.dateRange?.end;
				const initialEnd = initialFilter.dateRange === 'preview' ? previewDateRange.end : initialFilter.dateRange.end;
				const endDate = filterEnd ?? initialEnd;

				return {
					frequencyStats: countEntriesFromModules(set).filter(f => !isAfter(f.timestamp, endDate)),
					filter,
				};
			}),

			// Complete when/if the user calls .close()
			takeUntil(close$),
		);

		const errors$: Observable<Error> = searchMessages$.pipe(
			//add delay time after each search
			delayWhen(dynamicDelay),

			// Skip every regular message. We only want to emit when there's an error
			skipUntil(NEVER),

			// When there's an error, catch it and emit it
			catchError(err => of(err)),

			// Complete when/if the user calls .close()
			takeUntil(close$),
		);

		return {
			searchID: searchInitMsg.data.SearchID.toString(),

			progress$,
			entries$,
			stats$,
			statsOverview$,
			statsZoom$,
			errors$,

			setFilter,
			close,
		};
	};
};
