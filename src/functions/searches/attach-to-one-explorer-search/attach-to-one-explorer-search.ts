/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isEqual, isNil, isNull, uniqueId } from 'lodash';
import {
	BehaviorSubject,
	combineLatest,
	EMPTY,
	firstValueFrom,
	from,
	lastValueFrom,
	NEVER,
	Observable,
	of,
	Subject,
	Subscription,
} from 'rxjs';
import {
	catchError,
	concatMap,
	distinctUntilChanged,
	filter,
	filter as rxjsFilter,
	map,
	shareReplay,
	skipUntil,
	startWith,
	takeUntil,
	tap,
} from 'rxjs/operators';
import {
	ExplorerSearchEntries,
	ExplorerSearchSubscription,
	RawRequestSearchCloseMessageSent,
	RawRequestSearchDetailsMessageSent,
	RawRequestSearchStatsMessageSent,
	RawRequestSearchStatsWithinRangeMessageSent,
	RawResponseForSearchDetailsMessageReceived,
	RawResponseForSearchStatsMessageReceived,
	SearchEntries,
	SearchFilter,
	SearchMessageCommands,
	SearchStats,
	toSearchEntries,
} from '~/models';
import { toDataExplorerEntry } from '~/models/search/to-data-explorer-entry';
import { ID, Percentage } from '~/value-objects';
import { APIContext, debounceWithBackoffWhile } from '../../utils';
import { attachSearch } from '../attach-search';
import { createRequiredSearchFilterObservable, DateRange } from '../helpers/create-required-search-filter-observable';
import { makeSubscribeToOneRawSearch } from '../subscribe-to-one-raw-search';
import { RawRequestExplorerSearchEntriesWithinRangeMessageSent } from '~/models';
import {
	countEntriesFromModules,
	filterMessageByCommand,
	getDefaultGranularityByRendererType,
	recalculateZoomEnd,
	RequiredSearchFilter,
	SEARCH_FILTER_PREFIX,
} from '../subscribe-to-one-search/helpers';
import {
	createInitialSearchFilter,
	extractZoomFromRawSearchStats,
	mapToSearchStats,
} from '~/functions/searches/helpers/attach-search';
import { getPreviewDateRange, DEBOUNCE_OPTIONS } from '../helpers/attach-search';

export const makeAttachToOneExplorerSearch = (context: APIContext) => {
	const subscribeToOneRawSearch = makeSubscribeToOneRawSearch(context);
	let rawSubscriptionP: ReturnType<typeof subscribeToOneRawSearch> | null = null;
	let closedSub: Subscription | null = null;

	return async (
		searchID: ID,
		options: { filter?: Omit<SearchFilter, 'elementFilters'> } = {},
	): Promise<ExplorerSearchSubscription> => {
		if (isNull(rawSubscriptionP)) {
			rawSubscriptionP = subscribeToOneRawSearch();
			if (closedSub?.closed === false) {
				closedSub.unsubscribe();
			}

			// Handles websocket hangups from close or error
			closedSub = from(rawSubscriptionP)
				.pipe(
					concatMap(rawSubscription => rawSubscription.received$),
					catchError(() => EMPTY),
				)
				.subscribe({
					complete: () => {
						rawSubscriptionP = null;
					},
				});
		}
		const rawSubscription = await rawSubscriptionP;

		const searchAttachMsg = await attachSearch(rawSubscription, searchID);
		const searchTypeID = searchAttachMsg.data.Subproto;

		// The default dates are the StartRange and EndRange used to create the search
		const defaultStart = new Date(searchAttachMsg.data.Info.StartRange);
		const defaultEnd = new Date(searchAttachMsg.data.Info.EndRange);

		let closed = false;
		const close$ = new Subject<void>();

		const initialFilter = createInitialSearchFilter({ defaultStart, defaultEnd }, options);
		const initialFilterID = uniqueId(SEARCH_FILTER_PREFIX);

		const filtersByID: Record<string, SearchFilter | undefined> = {};
		filtersByID[initialFilterID] = initialFilter;

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
		const rendererType = searchAttachMsg.data.RendererMod;

		const previewDateRange: DateRange = await getPreviewDateRange({
			initialFilter,
			searchTypeID,
			searchMessages$,
			rawSubscription,
		});

		const close = async (): Promise<void> => {
			if (closed) return undefined;

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

		const entries$: Observable<ExplorerSearchEntries> = searchMessages$.pipe(
			filter(filterMessageByCommand(SearchMessageCommands.RequestExplorerEntriesWithinRange)),
			map(
				(msg): ExplorerSearchEntries => {
					const base = toSearchEntries(rendererType, msg);
					const filterID = (msg.data.Addendum?.filterID as string | undefined) ?? null;
					const filter = filtersByID[filterID ?? ''] ?? undefined;
					const searchEntries = { ...base, filter } as SearchEntries;
					const explorerEntries = (msg.data.Explore ?? []).map(toDataExplorerEntry);

					return { ...searchEntries, explorerEntries };
				},
			),
			tap(entries => {
				const defDesiredGranularity = getDefaultGranularityByRendererType(entries.type);
				initialFilter.desiredGranularity = defDesiredGranularity;
			}),

			shareReplay({ bufferSize: 1, refCount: true }),

			// Complete when/if the user calls .close()
			takeUntil(close$),
		);

		const _filter$ = new BehaviorSubject<SearchFilter>(initialFilter);
		const setFilter = (filter: SearchFilter | null): void => {
			if (closed) return undefined;
			_filter$.next(filter ?? initialFilter);
		};

		const filter$ = createRequiredSearchFilterObservable({
			filter$: _filter$.asObservable(),
			initialFilter,
			previewDateRange,
			defaultValues: {
				dateStart: defaultStart,
				dateEnd: defaultEnd,
			},
		}).pipe(
			// Complete when/if the user calls .close()
			takeUntil(close$),
		);

		const nextDetailsMsg = () =>
			firstValueFrom(
				searchMessages$.pipe(
					filter(filterMessageByCommand(SearchMessageCommands.RequestDetails)),
					// cleanup: Complete when/if the user calls .close()
					takeUntil(close$),
				),
			);

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
						// We've already received one details message - use it to start
						startWith(detailsMsg),

						// Extract the property that indicates if the data is finished
						map(details => (details ? details.data.Finished : false)),

						// Add dynamic debounce after each message
						debounceWithBackoffWhile(DEBOUNCE_OPTIONS),

						// Filter out finished events
						rxjsFilter(isFinished => isFinished === false),

						concatMap(() => rawSubscription.send(requestDetailsMsg)),
						catchError(() => EMPTY),
						takeUntil(close$),
					)
					.subscribe(),
			);

			const requestEntriesMsg: RawRequestExplorerSearchEntriesWithinRangeMessageSent = {
				type: searchTypeID,
				data: {
					ID: SearchMessageCommands.RequestExplorerEntriesWithinRange,
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
						map(entries => (entries ? entries.finished : false)),

						// Add dynamic debounce after each message
						debounceWithBackoffWhile(DEBOUNCE_OPTIONS),

						// Filter out finished events
						rxjsFilter(isFinished => isFinished === false),

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
						// Extract the property that indicates if the data is finished
						map(stats => stats.data.Finished ?? false),

						// Add dynamic debounce after each message
						debounceWithBackoffWhile(DEBOUNCE_OPTIONS),

						// Filter out finished events
						rxjsFilter(isFinished => isFinished === false),

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
							detailsMsg ? detailsMsg.data.SearchInfo.MinZoomWindow : 1,
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
						// Extract the property that indicates if the data is finished
						map(stats => stats.data.Finished ?? false),

						// Add dynamic debounce after each message
						debounceWithBackoffWhile(DEBOUNCE_OPTIONS),

						// Filter out finished events
						shareReplay({ bufferSize: 1, refCount: true }),
						rxjsFilter(isFinished => isFinished === false),

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
			setTimeout(() => requestEntries(filter), 2000); // TODO: Change this
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
			mapToSearchStats({ filtersByID, searchAttachMsg }),

			distinctUntilChanged<SearchStats>(isEqual),

			shareReplay({ bufferSize: 1, refCount: false }),

			// Complete when/if the user calls .close()
			takeUntil(close$),
		);

		const statsOverview$ = rawSearchStats$.pipe(
			map(set => {
				return { frequencyStats: countEntriesFromModules(set) };
			}),

			shareReplay({ bufferSize: 1, refCount: true }),

			// Complete when/if the user calls .close()
			takeUntil(close$),
		);

		const statsZoom$ = rawStatsZoom$.pipe(
			extractZoomFromRawSearchStats({
				filtersByID,
				initialFilter,
				previewDateRange,
			}),

			shareReplay({ bufferSize: 1, refCount: true }),

			// Complete when/if the user calls .close()
			takeUntil(close$),
		);

		const errors$: Observable<Error> = searchMessages$.pipe(
			// Skip every regular message. We only want to emit when there's an error
			skipUntil(NEVER),

			// When there's an error, catch it and emit it
			catchError(err => of(err)),

			shareReplay({ bufferSize: 1, refCount: true }),

			// Complete when/if the user calls .close()
			takeUntil(close$),
		);

		return {
			searchID,

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
