/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isBoolean, isEqual, isNull, uniqueId } from 'lodash';
import {
	BehaviorSubject,
	combineLatest,
	EMPTY,
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
	map,
	shareReplay,
	switchMap,
	takeUntil,
	tap,
} from 'rxjs/operators';
import {
	collectSearchObservableErrors,
	createInitialSearchFilter,
	makeToSearchStats,
	makeToStatsZoom,
} from '~/functions/searches/helpers/attach-search';
import { getRawRequestExplorerEntriesMsg, makeRequestEntries } from '~/functions/searches/helpers/request-entries';
import {
	ExplorerSearchEntries,
	ExplorerSearchSubscription,
	RawRequestSearchCloseMessageSent,
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
import { APIContext } from '../../utils/api-context';
import { attachSearch } from '../attach-search';
import { getPreviewDateRange } from '../helpers/attach-search';
import { createRequiredSearchFilterObservable, DateRange } from '../helpers/create-required-search-filter-observable';
import { makeSubscribeToOneRawSearch } from '../subscribe-to-one-raw-search';
import {
	countEntriesFromModules,
	filterMessageByCommand,
	getDefaultGranularityByRendererType,
	SEARCH_FILTER_PREFIX,
} from '../subscribe-to-one-search/helpers';

export const makeAttachToOneExplorerSearch = (
	context: APIContext,
): ((searchID: ID) => Promise<ExplorerSearchSubscription>) => {
	const subscribeToOneRawSearch = makeSubscribeToOneRawSearch(context);
	let rawSubscriptionP: ReturnType<typeof subscribeToOneRawSearch> | null = null;
	let closedSub: Subscription | null = null;

	return async (searchID: ID): Promise<ExplorerSearchSubscription> => {
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

		const searchAttachMsg = await attachSearch(rawSubscription, searchID);
		const searchTypeID = searchAttachMsg.data.Subproto;

		// The default dates are the StartRange and EndRange used to create the search
		const defaultStart = new Date(searchAttachMsg.data.Info.StartRange);
		const defaultEnd = new Date(searchAttachMsg.data.Info.EndRange);

		let closed = false;
		const close$ = new Subject<void>();

		const initialFilter = createInitialSearchFilter({ defaultStart, defaultEnd });
		const initialFilterID = uniqueId(SEARCH_FILTER_PREFIX);

		const filtersByID: Record<string, SearchFilter | undefined> = {};
		filtersByID[initialFilterID] = initialFilter;

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
		const rendererType = searchAttachMsg.data.RendererMod;

		const previewDateRange: DateRange = await getPreviewDateRange({
			initialFilter,
			searchTypeID,
			searchMessages$,
			rawSubscription,
		});

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

		const entries$: Observable<ExplorerSearchEntries> = searchMessages$.pipe(
			filter(filterMessageByCommand(SearchMessageCommands.RequestExplorerEntriesWithinRange)),
			map((msg): ExplorerSearchEntries => {
				const base = toSearchEntries(rendererType, msg);
				const filterID = (msg.data.Addendum?.filterID as string | undefined) ?? null;
				const filterByID = filtersByID[filterID ?? ''] ?? undefined;
				const searchEntries = { ...base, filter: filterByID } as SearchEntries;
				const explorerEntries = (msg.data.Explore ?? []).map(toDataExplorerEntry);

				return { ...searchEntries, explorerEntries };
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
		const setFilter = (filterSearch: SearchFilter | null): void => {
			if (closed) {
				return undefined;
			}
			_filter$.next(filterSearch ?? initialFilter);
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

		const requestEntries = makeRequestEntries({
			close$,
			entries$,
			filtersByID,
			previewDateRange,
			rawSearchDetails$,
			rawSearchStats$,
			rawStatsZoom$,
			rawSubscription,
			searchMessages$,
			searchTypeID,
			getRawRequestEntriesMessage: getRawRequestExplorerEntriesMsg,
			isClosed: () => closed,
		});

		/**
		 * When filter is available, immediately apply and re-apply again after two
		 * seconds.
		 * https://github.com/gravwell/js-client/pull/243/files#diff-84ea62a6dd70168a514bb4173174a56cbe5089b2004ac111d42e15a769b3fd7eR421.
		 */
		filter$.pipe(takeUntil(close$)).subscribe({
			next: filterNext => requestEntries(filterNext),
			error: err => console.warn('failed to apply filter to search', err),
		});
		filter$
			.pipe(
				switchMap(filterSwitchMap => timer(2000).pipe(map(() => filterSwitchMap))),
				takeUntil(close$),
			)
			.subscribe({
				next: filterNext => requestEntries(filterNext),
				error: err => console.warn('failed to apply filter to search after two second delay', err),
			});

		const stats$ = combineLatest([
			rawSearchStats$.pipe(distinctUntilChanged<RawResponseForSearchStatsMessageReceived>(isEqual)),
			rawSearchDetails$.pipe(distinctUntilChanged<RawResponseForSearchDetailsMessageReceived>(isEqual)),
		]).pipe(
			map(makeToSearchStats({ filtersByID, searchAttachMsg })),

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
			map(
				makeToStatsZoom({
					filtersByID,
					initialFilter,
					previewDateRange,
				}),
			),

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
