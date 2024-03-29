/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isAfter, subHours } from 'date-fns';
import { cloneDeep, isBoolean, isEqual, isNil, isNull, uniqueId } from 'lodash';
import {
	BehaviorSubject,
	combineLatest,
	EMPTY,
	firstValueFrom,
	from,
	lastValueFrom,
	merge,
	Observable,
	Subject,
	Subscription,
	timer,
} from 'rxjs';
import {
	catchError,
	concatMap,
	distinctUntilChanged,
	filter,
	filter as rxjsFilter,
	map,
	shareReplay,
	startWith,
	switchMap,
	takeUntil,
	tap,
} from 'rxjs/operators';
import { Query } from '~/models/query';
import {
	RawResponseForSearchDetailsMessageReceived,
	RawResponseForSearchStatsMessageReceived,
} from '~/models/search/raw-search-message-received';
import {
	RawRequestSearchCloseMessageSent,
	RawRequestSearchDetailsMessageSent,
	RawRequestSearchEntriesWithinRangeMessageSent,
	RawRequestSearchStatsMessageSent,
	RawRequestSearchStatsWithinRangeMessageSent,
} from '~/models/search/raw-search-message-sent';
import { SearchEntries } from '~/models/search/search-entries';
import { SearchFilter } from '~/models/search/search-filter';
import { SearchMessageCommands } from '~/models/search/search-message-commands';
import { SearchStats } from '~/models/search/search-stats';
import { SearchSubscription } from '~/models/search/search-subscription';
import { toSearchEntries } from '~/models/search/to-search-entries';
import { toNumericID } from '~/value-objects/id';
import { RawJSON } from '~/value-objects/json';
import { Percentage } from '~/value-objects/percentage';
import { APIContext } from '../../utils/api-context';
import { debounceWithBackoffWhile } from '../../utils/debounce-with-backoff-while';
import { omitUndefinedShallow } from '../../utils/omit-undefined-shallow';
import { collectSearchObservableErrors } from '../helpers/attach-search';
import { createRequiredSearchFilterObservable } from '../helpers/create-required-search-filter-observable';
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

interface Options {
	filter?: SearchFilter | undefined;
	metadata?: RawJSON | undefined;
	noHistory?: boolean;
}

export const makeSubscribeToOneSearch = (
	context: APIContext,
): ((query: Query, options?: Options) => Promise<SearchSubscription>) => {
	const modifyOneQuery = makeModifyOneQuery(context);
	const subscribeToOneRawSearch = makeSubscribeToOneRawSearch(context);
	let rawSubscriptionP: ReturnType<typeof subscribeToOneRawSearch> | null = null;
	let closedSub: Subscription | null = null;

	return async (query: Query, options: Options = {}): Promise<SearchSubscription> => {
		if (isNull(rawSubscriptionP)) {
			rawSubscriptionP = subscribeToOneRawSearch();
			if (closedSub?.closed === false) {
				closedSub.unsubscribe();
			}

			// Handles websocket hangups from close or error
			closedSub = from(rawSubscriptionP)
				.pipe(
					concatMap(rawSubscriptionConcatMap => rawSubscriptionConcatMap.received$),
					catchError(() => EMPTY),
				)
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

		const searchInitMsg = await initiateSearch(
			rawSubscription,
			modifiedQuery,
			omitUndefinedShallow({
				initialFilterID,
				metadata: options.metadata,
				range:
					initialFilter.dateRange === 'preview'
						? 'preview'
						: [initialFilter.dateRange.start, initialFilter.dateRange.end],
				noHistory: options.noHistory,
			}),
		);
		const searchTypeID = searchInitMsg.data.OutputSearchSubproto;
		const searchMessages$ = rawSubscription.received$.pipe(
			filter(msg => msg.type === searchTypeID),
			tap(msg => {
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
			if (initialFilter.dateRange !== 'preview') {
				return initialFilter.dateRange;
			}

			// In preview mode, so we need to request search details and use the timerange that we get back
			const detailsP = firstValueFrom(
				searchMessages$.pipe(filter(filterMessageByCommand(SearchMessageCommands.RequestDetails))),
			);
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
			if (closed) {
				return undefined;
			}

			const closeMsg: RawRequestSearchCloseMessageSent = {
				type: searchTypeID,
				data: { ID: SearchMessageCommands.Close },
			};
			await rawSubscription.send(closeMsg);

			// Wait for closed message to be received
			await lastValueFrom(close$);
		};

		const progress$: Observable<Percentage> = searchMessages$.pipe(
			map(msg => (msg as Partial<RawResponseForSearchDetailsMessageReceived>).data?.Finished ?? null),
			filter(isBoolean),
			map(done => (done ? 1 : 0)),
			distinctUntilChanged(),
			map(rawPercentage => new Percentage(rawPercentage)),

			shareReplay({ bufferSize: 1, refCount: true }),

			// Complete when/if the user calls .close()
			takeUntil(close$),
		);

		const entries$: Observable<SearchEntries> = searchMessages$.pipe(
			filter(filterMessageByCommand(SearchMessageCommands.RequestEntriesWithinRange)),
			map((msg): SearchEntries => {
				const base = toSearchEntries(rendererType, msg);
				const filterID = (msg.data.Addendum?.filterID as string | undefined) ?? null;
				const filterMap = filtersByID[filterID ?? ''] ?? undefined;
				return { ...base, filter: filterMap } as SearchEntries;
			}),
			tap(entries => {
				const defDesiredGranularity = getDefaultGranularityByRendererType(entries.type);
				initialFilter.desiredGranularity = defDesiredGranularity;
			}),

			shareReplay({ bufferSize: 1, refCount: true }),

			// Complete when/if the user calls .close()
			takeUntil(close$),
		);

		const _filter$ = new BehaviorSubject<SearchFilter>(initialFilter);
		const setFilter = (filterSet: SearchFilter | null): void => {
			if (closed) {
				return undefined;
			}
			_filter$.next(filterSet ?? initialFilter);
		};

		const filter$ = createRequiredSearchFilterObservable({
			filter$: _filter$.asObservable(),
			initialFilter,
			previewDateRange,
			defaultValues: {
				dateStart: defaultStart,
				dateEnd: defaultEnd,
			},
		});

		const nextDetailsMsg = (): Promise<RawResponseForSearchDetailsMessageReceived> =>
			firstValueFrom(
				searchMessages$.pipe(
					filter(filterMessageByCommand(SearchMessageCommands.RequestDetails)),
					// cleanup: Complete when/if the user calls .close()
					takeUntil(close$),
				),
			);

		let pollingSubs: Subscription;

		const requestEntries = async (filterEntries: RequiredSearchFilter): Promise<void> => {
			if (closed) {
				return undefined;
			}

			if (!isNil(pollingSubs)) {
				pollingSubs.unsubscribe();
			}
			pollingSubs = new Subscription();

			const filterID = uniqueId(SEARCH_FILTER_PREFIX);
			filtersByID[filterID] = filterEntries;

			const first = filterEntries.entriesOffset.index;
			const last = first + filterEntries.entriesOffset.count;
			const startDate = filterEntries.dateRange === 'preview' ? previewDateRange.start : filterEntries.dateRange.start;
			const start = startDate.toISOString();
			const endDate = filterEntries.dateRange === 'preview' ? previewDateRange.end : filterEntries.dateRange.end;
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

			// Dynamic duration for debounce after each event, starting from 1s and increasing 500ms after each event,
			// never surpass 4s, reset to 1s if the request is finished
			const debounceOptions = {
				initialDueTime: 1000,
				step: 500,
				maxDueTime: 4000,
				predicate: (isFinished: boolean) => isFinished === false, // increase backoff while isFinished is false
			};

			// Keep sending requests for search details until Finished is true
			pollingSubs.add(
				rawSearchDetails$
					.pipe(
						// We've already received one details message - use it to start
						startWith(detailsMsg),

						// Extract the property that indicates if the data is finished
						map(details => details.data.Finished),

						// Add dynamic debounce after each message
						debounceWithBackoffWhile(debounceOptions),

						// Filter out finished events
						rxjsFilter(isFinished => isFinished === false),

						concatMap(() => rawSubscription.send(requestDetailsMsg)),
						catchError(() => EMPTY),
						takeUntil(close$),
					)
					.subscribe({ error: err => console.warn(err) }),
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
						// Extract the property that indicates if the data is finished
						map(entries => entries.finished),

						// Add dynamic debounce after each message
						debounceWithBackoffWhile(debounceOptions),

						// Filter out finished events
						rxjsFilter(isFinished => isFinished === false),

						concatMap(() => rawSubscription.send(requestEntriesMsg)),
						catchError(() => EMPTY),
						takeUntil(close$),
					)
					.subscribe({ error: err => console.warn(err) }),
			);
			const entriesP = rawSubscription.send(requestEntriesMsg);

			const requestStatsMessage: RawRequestSearchStatsMessageSent = {
				type: searchTypeID,
				data: {
					ID: SearchMessageCommands.RequestAllStats,
					Addendum: { filterID },
					Stats: { SetCount: filterEntries.overviewGranularity },
				},
			};
			// Keep sending requests for stats until finished is true
			pollingSubs.add(
				rawSearchStats$
					.pipe(
						// Extract the property that indicates if the data is finished
						map(stats => stats.data.Finished ?? false),

						// Add dynamic debounce after each message
						debounceWithBackoffWhile(debounceOptions),

						// Filter out finished events
						rxjsFilter(isFinished => isFinished === false),

						concatMap(() => rawSubscription.send(requestStatsMessage)),
						catchError(() => EMPTY),
						takeUntil(close$),
					)
					.subscribe({ error: err => console.warn(err) }),
			);
			const statsP = rawSubscription.send(requestStatsMessage);

			const requestStatsWithinRangeMsg: RawRequestSearchStatsWithinRangeMessageSent = {
				type: searchTypeID,
				data: {
					ID: SearchMessageCommands.RequestStatsInRange,
					Addendum: { filterID },
					Stats: {
						SetCount: filterEntries.zoomGranularity,
						SetEnd: recalculateZoomEnd(
							detailsMsg.data.SearchInfo.MinZoomWindow,
							filterEntries.zoomGranularity,
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
						// Extract the property that indicates if the data is finished
						map(stats => stats.data.Finished ?? false),

						// Add dynamic debounce after each message
						debounceWithBackoffWhile(debounceOptions),

						// Filter out finished events
						rxjsFilter(isFinished => isFinished === false),

						concatMap(() => rawSubscription.send(requestStatsWithinRangeMsg)),
						catchError(() => EMPTY),
						takeUntil(close$),
					)
					.subscribe({ error: err => console.warn(err) }),
			);
			const statsRangeP = rawSubscription.send(requestStatsWithinRangeMsg);

			await Promise.all([entriesP, statsP, detailsP, statsRangeP]);
		};

		/**
		 * When filter is available, immediately apply and re-apply again after two
		 * seconds.
		 * https://github.com/gravwell/js-client/pull/243/files#diff-84ea62a6dd70168a514bb4173174a56cbe5089b2004ac111d42e15a769b3fd7eR421.
		 */
		filter$.pipe(takeUntil(close$)).subscribe({
			next: filterEntries => requestEntries(filterEntries),
			error: err => console.warn('failed to apply filter to search', err),
		});
		filter$
			.pipe(
				switchMap(filterEntries => timer(2000).pipe(map(() => filterEntries))),
				takeUntil(close$),
			)
			.subscribe({
				next: filterEntries => requestEntries(filterEntries),
				error: err => console.warn('failed to apply filter to search after two second delay', err),
			});

		const rawSearchStats$ = searchMessages$.pipe(
			filter(filterMessageByCommand(SearchMessageCommands.RequestAllStats)),

			// Complete when/if the user calls .close()
			takeUntil(close$),
		);

		const rawSearchDetails$ = searchMessages$.pipe(
			filter(filterMessageByCommand(SearchMessageCommands.RequestDetails)),

			// Complete when/if the user calls .close()
			takeUntil(close$),
		);

		const rawStatsZoom$ = searchMessages$.pipe(
			filter(filterMessageByCommand(SearchMessageCommands.RequestStatsInRange)),

			// Complete when/if the user calls .close()
			takeUntil(close$),
		);

		const stats$ = combineLatest([
			rawSearchStats$.pipe(distinctUntilChanged<RawResponseForSearchStatsMessageReceived>(isEqual)),
			rawSearchDetails$.pipe(distinctUntilChanged<RawResponseForSearchDetailsMessageReceived>(isEqual)),
		]).pipe(
			map(([rawStats, rawDetails]): SearchStats => {
				const filterID =
					(rawStats.data.Addendum?.filterID as string | undefined) ??
					(rawDetails.data.Addendum?.filterID as string | undefined) ??
					null;
				const filterByID = filtersByID[filterID ?? ''] ?? undefined;

				const pipeline = rawStats.data.Stats.Set.map(s => s.Stats)
					.reduce<
						Array<Array<RawResponseForSearchStatsMessageReceived['data']['Stats']['Set'][number]['Stats'][number]>>
					>((acc, curr) => {
						curr.forEach((_curr, i) => {
							const tmp = cloneDeep(acc[i] ?? []);
							tmp.push(_curr);
							acc[i] = tmp;
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

				return omitUndefinedShallow({
					id: rawDetails.data.SearchInfo.ID,
					userID: toNumericID(rawDetails.data.SearchInfo.UID),

					filterByID,
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
				});
			}),

			distinctUntilChanged<SearchStats>(isEqual),

			shareReplay({ bufferSize: 1, refCount: false }),

			// Complete when/if the user calls .close()
			takeUntil(close$),
		);

		const statsOverview$ = rawSearchStats$.pipe(
			map(set => ({ frequencyStats: countEntriesFromModules(set) })),

			shareReplay({ bufferSize: 1, refCount: true }),

			// Complete when/if the user calls .close()
			takeUntil(close$),
		);

		const statsZoom$ = rawStatsZoom$.pipe(
			map(set => {
				const filterID = (set.data.Addendum?.filterID as string | undefined) ?? null;
				const filterByID = filtersByID[filterID ?? ''] ?? undefined;

				const filterEnd = filterByID?.dateRange === 'preview' ? previewDateRange.end : filterByID?.dateRange?.end;
				const initialEnd = initialFilter.dateRange === 'preview' ? previewDateRange.end : initialFilter.dateRange.end;
				const endDate = filterEnd ?? initialEnd;

				return omitUndefinedShallow({
					frequencyStats: countEntriesFromModules(set).filter(f => !isAfter(f.timestamp, endDate)),
					filterByID,
				});
			}),

			shareReplay({ bufferSize: 1, refCount: true }),

			// Complete when/if the user calls .close()
			takeUntil(close$),
		);

		const errorMsg$: Observable<Error> = searchMessages$.pipe(
			filter(filterMessageByCommand(SearchMessageCommands.ResponseError)),
			map(msg => new Error(msg.data.Error)),
		);

		const errors$ = merge(
			errorMsg$,
			collectSearchObservableErrors(progress$, entries$, stats$, statsOverview$, statsZoom$),
		).pipe(takeUntil(close$));

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
