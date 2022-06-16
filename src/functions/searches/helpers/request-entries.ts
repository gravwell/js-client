/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNil, uniqueId } from 'lodash';
import { EMPTY, firstValueFrom, Observable, Subscription } from 'rxjs';
import { catchError, filter, map, shareReplay, startWith, takeUntil } from 'rxjs/operators';
import { debouncedPooling } from '~/functions/searches/helpers/attach-search';
import { APISubscription } from '~/functions/utils';
import {
	RawRequestExplorerSearchEntriesWithinRangeMessageSent,
	RawRequestSearchDetailsMessageSent,
	RawRequestSearchEntriesWithinRangeMessageSent,
	RawRequestSearchStatsMessageSent,
	RawRequestSearchStatsWithinRangeMessageSent,
	RawSearchMessageReceived,
	RawSearchMessageSent,
	SearchFilter,
	SearchMessageCommands,
} from '~/models';
import {
	filterMessageByCommand,
	recalculateZoomEnd,
	RequiredSearchFilter,
	SEARCH_FILTER_PREFIX,
} from '../subscribe-to-one-search/helpers';
import { DateRange } from './create-required-search-filter-observable';

export const makeRequestEntries: (props: {
	close$: Observable<void>;
	entries$: Observable<any>;
	filtersByID: Record<string, SearchFilter | undefined>;
	previewDateRange: DateRange;
	rawSearchDetails$: Observable<any>;
	rawSearchStats$: Observable<any>;
	rawStatsZoom$: Observable<any>;
	rawSubscription: APISubscription<RawSearchMessageReceived, RawSearchMessageSent>;
	searchMessages$: Observable<any>;
	searchTypeID: string;
	getRawRequestEntriesMsg: IGetRequestEntries<
		RawRequestExplorerSearchEntriesWithinRangeMessageSent | RawRequestSearchEntriesWithinRangeMessageSent
	>;
	isClosed: () => boolean;
}) => (filter: RequiredSearchFilter) => Promise<void> = ({
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
	getRawRequestEntriesMsg,
	isClosed,
}) => {
	const nextDetailsMsg = () =>
		firstValueFrom(
			searchMessages$.pipe(
				filter(filterMessageByCommand(SearchMessageCommands.RequestDetails)),
				// cleanup: Complete when/if the user calls .close()
				takeUntil(close$),
			),
		);

	let pollingSubs: Subscription;

	return async (filter): Promise<void> => {
		if (isClosed()) return undefined;

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
		const requestEntriesMsg = getRawRequestEntriesMsg({ end, filterID, first, last, searchTypeID, start });

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

					debouncedPooling({ rawSubscription, message: requestDetailsMsg }),

					catchError(() => EMPTY),
					takeUntil(close$),
				)
				.subscribe(),
		);

		// Keep sending requests for entries until finished is true
		pollingSubs.add(
			entries$
				.pipe(
					// Extract the property that indicates if the data is finished
					map(entries => (entries ? entries.finished : false)),

					debouncedPooling({ rawSubscription, message: requestEntriesMsg }),

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

					debouncedPooling({ rawSubscription, message: requestStatsMessage }),

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

					debouncedPooling({ rawSubscription, message: requestStatsWithinRangeMsg }),

					// Filter out finished events
					shareReplay({ bufferSize: 1, refCount: true }),

					catchError(() => EMPTY),
					takeUntil(close$),
				)
				.subscribe(),
		);
		const statsRangeP = rawSubscription.send(requestStatsWithinRangeMsg);

		await Promise.all([entriesP, statsP, detailsP, statsRangeP]);
	};
};

export type IGetRequestEntries<T> = (props: {
	end: string;
	filterID: string;
	first: number;
	last: number;
	searchTypeID: string;
	start: string;
}) => T;

export const getRawRequestEntriesMsg: IGetRequestEntries<RawRequestSearchEntriesWithinRangeMessageSent> = ({
	end,
	filterID,
	first,
	last,
	searchTypeID,
	start,
}) => {
	return {
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
};

/* Get the Raw */
export const getRawRequestExplorerEntriesMsg: IGetRequestEntries<RawRequestExplorerSearchEntriesWithinRangeMessageSent> = ({
	end,
	filterID,
	first,
	last,
	searchTypeID,
	start,
}) => {
	return {
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
};
