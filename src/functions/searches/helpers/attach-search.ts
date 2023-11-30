/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isAfter } from 'date-fns';
import {
	catchError,
	concatMap,
	filter,
	firstValueFrom,
	from,
	merge,
	mergeMap,
	NEVER,
	Observable,
	of,
	shareReplay,
	skipUntil,
	timeout,
} from 'rxjs';
import { DateRange } from '~/functions/searches/helpers/create-required-search-filter-observable';
import { APISubscription } from '~/functions/utils/api-subscription';
import { debounceWithBackoffWhile } from '~/functions/utils/debounce-with-backoff-while';
import { omitUndefinedShallow } from '~/functions/utils/omit-undefined-shallow';
import { SearchFilter } from '~/index';
import {
	RawRequestSearchDetailsMessageSent,
	RawResponseForSearchDetailsMessageReceived,
	RawResponseForSearchStatsMessageReceived,
	RawResponseForSearchStatsWithinRangeMessageReceived,
	RawSearchAttachedMessageReceived,
	RawSearchMessageReceived,
	RawSearchMessageSent,
	SearchFrequencyStats,
	SearchMessageCommands,
	SearchStats,
} from '~/models';
import { toNumericID } from '~/value-objects';
import {
	countEntriesFromModules,
	filterMessageByCommand,
	RequiredSearchFilter,
} from '../../searches/subscribe-to-one-search/helpers';

// Dynamic duration for debounce a after each event, starting from 1s and increasing 500ms after each event,
// never surpass 4s, reset to 1s if the request is finished
export const DEBOUNCE_OPTIONS = {
	initialDueTime: 1000,
	step: 500,
	maxDueTime: 4000,
	predicate: (isFinished: boolean) => !isFinished, // increase backoff while isFinished is false
};

export const defaultSearchFilterEntriesOffsetCount = 100;

export const createInitialSearchFilter: (requiredValues: {
	defaultStart: Date;
	defaultEnd: Date;
}) => RequiredSearchFilter = ({ defaultStart, defaultEnd }) => ({
	entriesOffset: {
		index: 0,
		count: defaultSearchFilterEntriesOffsetCount,
	},
	dateRange: {
		start: defaultStart,
		end: defaultEnd,
	},
	// *NOTE: The default granularity is recalculated when we receive the renderer type
	desiredGranularity: 100,
	overviewGranularity: 90,
	zoomGranularity: 90,
	elementFilters: [],
});

export const getPreviewDateRange: (props: {
	initialFilter: RequiredSearchFilter;
	searchTypeID: string;
	searchMessages$: Observable<RawSearchMessageReceived>;
	rawSubscription: APISubscription<RawSearchMessageReceived, RawSearchMessageSent>;
}) => Promise<DateRange> = async ({ initialFilter, searchTypeID, searchMessages$, rawSubscription }) => {
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
};

export type MakeToStatsZoom = (
	props: Readonly<{
		filtersByID: Record<string, SearchFilter | undefined>;
		initialFilter: RequiredSearchFilter;
		previewDateRange: DateRange;
	}>,
) => (raw: RawResponseForSearchStatsWithinRangeMessageReceived) => {
	frequencyStats: Array<SearchFrequencyStats>;
	filter?: SearchFilter;
};

export const makeToStatsZoom: MakeToStatsZoom =
	({ filtersByID, initialFilter, previewDateRange }) =>
	set => {
		const filterID = (set.data.Addendum?.filterID as string | undefined) ?? null;
		const filterByID = filtersByID[filterID ?? ''] ?? undefined;

		const filterEnd = filterByID?.dateRange === 'preview' ? previewDateRange.end : filterByID?.dateRange?.end;
		const initialEnd = initialFilter.dateRange === 'preview' ? previewDateRange.end : initialFilter.dateRange.end;
		const endDate = filterEnd ?? initialEnd;

		return omitUndefinedShallow({
			frequencyStats: countEntriesFromModules(set).filter(f => !isAfter(f.timestamp, endDate)),
			filter: filterByID,
		});
	};

export type MakeToSearchStats = (
	props: Readonly<{
		filtersByID: Record<string, SearchFilter | undefined>;
		searchAttachMsg: RawSearchAttachedMessageReceived;
	}>,
) => (args: [RawResponseForSearchStatsMessageReceived, RawResponseForSearchDetailsMessageReceived]) => SearchStats;
export const makeToSearchStats: MakeToSearchStats =
	({ filtersByID, searchAttachMsg }) =>
	([rawStats, rawDetails]) => {
		const filterID =
			(rawStats.data.Addendum?.filterID as string | undefined) ??
			(rawDetails.data.Addendum?.filterID as string | undefined) ??
			null;
		const filterByID = filtersByID[filterID ?? ''] ?? undefined;

		const pipeline = rawStats.data.Stats.Set.map(s => s.Stats)
			.reduce<Array<Array<RawResponseForSearchStatsMessageReceived['data']['Stats']['Set'][number]['Stats'][number]>>>(
				(acc, curr) => {
					curr.forEach((_curr, i) => {
						const tmp = acc[i] ?? [];
						tmp.push(_curr);
						acc[i] = tmp;
					});
					return acc;
				},
				[],
			)
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

			filter: filterByID,
			finished: rawStats.data.Finished && rawDetails.data.Finished,

			query: searchAttachMsg.data.Info.UserQuery,
			effectiveQuery: searchAttachMsg.data.Info.EffectiveQuery,

			metadata: searchAttachMsg.data.Info.Metadata ?? {},
			entries: rawStats.data.EntryCount,
			duration: rawDetails.data.SearchInfo.Duration,
			start: new Date(rawDetails.data.SearchInfo.StartRange),
			end: new Date(rawDetails.data.SearchInfo.EndRange),
			minZoomWindow: rawDetails.data.SearchInfo.MinZoomWindow,
			downloadFormats: rawDetails.data.SearchInfo.RenderDownloadFormats,
			tags: searchAttachMsg.data.Info.Tags,

			storeSize: rawDetails.data.SearchInfo.StoreSize,
			processed: {
				entries: pipeline[0]?.input?.entries ?? 0,
				bytes: pipeline[0]?.input?.bytes ?? 0,
			},

			pipeline,
		});
	};

/**
 * Dynamically debounces after each message, then filters out finished events,
 * and then sends the message in order.
 */
export const debouncedPooling: <MessageReceived, MessageSent>(
	props: Readonly<{
		rawSubscription: APISubscription<MessageReceived, MessageSent>;
		message: MessageSent;
	}>,
) => (source: Observable<boolean>) => Observable<void> =
	({ rawSubscription, message }) =>
	source$ =>
		source$.pipe(
			// Add dynamic debounce after each message
			debounceWithBackoffWhile(DEBOUNCE_OPTIONS),

			// Filter out finished events
			filter(isFinished => isFinished === false),

			concatMap(() => rawSubscription.send(message)),
		);

export const emitError: () => <T>(source: Observable<T>) => Observable<Error> = () => source$ =>
	source$.pipe(
		// Skip every regular message. We only want to emit when there's an error
		skipUntil(NEVER),

		// When there's an error, catch it and emit it
		catchError(err => of(err)),

		shareReplay({ bufferSize: 1, refCount: true }),
	);

/**
 * Given a list of search related observables, this function will return an
 * observable that emits an error when
 *
 * 1. Any of the given observable encounter an error.
 * 2. Ten seconds have pass and any of the given observables have not emitted a
 *    value. This is to show end users an error message if a transport error has
 *    occurred. See
 *    https://github.com/gravwell/frontend-issues/issues/5851#issuecomment-1353720239.
 */
export const collectSearchObservableErrors = (...observables: Array<Observable<unknown>>): Observable<Error> => {
	const TIMEOUT = 10_000;
	/**
	 * This will emit an error if any of the given observables don't emit within
	 * 10 seconds. Not emitting within 10 seconds is indicative of a transport
	 * failure. E.G. a reverse proxy could have dropped a websocket message we
	 * expected to receive.
	 */
	const timeoutError$ = from(observables).pipe(
		mergeMap(obs$ => obs$.pipe(timeout({ first: TIMEOUT }))),
		emitError(),
	);
	/** This will emit when any errors occur in the given observables. */
	const websocketErrors$ = merge(observables).pipe(emitError());
	/** Transport + observable errors. */
	return merge(timeoutError$, websocketErrors$).pipe(shareReplay({ bufferSize: 1, refCount: true }));
};
