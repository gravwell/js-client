/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isAfter } from 'date-fns';
import { isUndefined } from 'lodash';
import { catchError, concatMap, filter, firstValueFrom, NEVER, Observable, of, shareReplay, skipUntil } from 'rxjs';
import { DateRange } from '~/functions';
import { APISubscription, debounceWithBackoffWhile } from '~/functions/utils';
import { SearchFilter } from '~/main';
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

export const createInitialSearchFilter: (
	requiredValues: { defaultStart: Date; defaultEnd: Date },
	options?: { filter?: Omit<SearchFilter, 'elementFilters'> },
) => RequiredSearchFilter = ({ defaultStart, defaultEnd }, options = {}) => ({
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
	elementFilters: [],
});

export const getPreviewDateRange: (props: {
	initialFilter: RequiredSearchFilter;
	searchTypeID: string;
	searchMessages$: Observable<RawSearchMessageReceived>;
	rawSubscription: APISubscription<RawSearchMessageReceived, RawSearchMessageSent>;
}) => Promise<DateRange> = async ({ initialFilter, searchTypeID, searchMessages$, rawSubscription }) => {
	// Not in preview mode, so return the initial filter date range, whatever, it won't be used
	if (initialFilter.dateRange !== 'preview') return initialFilter.dateRange;

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
) => (
	raw: RawResponseForSearchStatsWithinRangeMessageReceived,
) => {
	frequencyStats: Array<SearchFrequencyStats>;
	filter: SearchFilter | undefined;
};
export const makeToStatsZoom: MakeToStatsZoom = ({ filtersByID, initialFilter, previewDateRange }) => set => {
	const filterID = (set.data.Addendum?.filterID as string | undefined) ?? null;
	const filter = filtersByID[filterID ?? ''] ?? undefined;

	const filterEnd = filter?.dateRange === 'preview' ? previewDateRange.end : filter?.dateRange?.end;
	const initialEnd = initialFilter.dateRange === 'preview' ? previewDateRange.end : initialFilter.dateRange.end;
	const endDate = filterEnd ?? initialEnd;

	return {
		frequencyStats: countEntriesFromModules(set).filter(f => !isAfter(f.timestamp, endDate)),
		filter,
	};
};

export type MakeToSearchStats = (
	props: Readonly<{
		filtersByID: Record<string, SearchFilter | undefined>;
		searchAttachMsg: RawSearchAttachedMessageReceived;
	}>,
) => (args: [RawResponseForSearchStatsMessageReceived, RawResponseForSearchDetailsMessageReceived]) => SearchStats;
export const makeToSearchStats: MakeToSearchStats = ({ filtersByID, searchAttachMsg }) => ([rawStats, rawDetails]) => {
	const filterID =
		(rawStats.data.Addendum?.filterID as string | undefined) ??
		(rawDetails.data.Addendum?.filterID as string | undefined) ??
		null;
	const filter = filtersByID[filterID ?? ''] ?? undefined;

	const pipeline = rawStats.data.Stats.Set.map(s => s.Stats)
		.reduce<Array<Array<RawResponseForSearchStatsMessageReceived['data']['Stats']['Set'][number]['Stats'][number]>>>(
			(acc, curr) => {
				curr.forEach((_curr, i) => {
					if (isUndefined(acc[i])) acc[i] = [];
					acc[i].push(_curr);
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

	return {
		id: rawDetails.data.SearchInfo.ID,
		userID: toNumericID(rawDetails.data.SearchInfo.UID),

		filter,
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
	};
};

/**
 * Dynamically debounces after each message, then filters out finished events, and then sends the message in order.
 */
export const debouncedPooling: <MessageReceived, MessageSent>(
	props: Readonly<{
		rawSubscription: APISubscription<MessageReceived, MessageSent>;
		message: MessageSent;
	}>,
) => (source: Observable<boolean>) => Observable<void> = ({ rawSubscription, message }) => source =>
	source.pipe(
		// Add dynamic debounce after each message
		debounceWithBackoffWhile(DEBOUNCE_OPTIONS),

		// Filter out finished events
		filter(isFinished => isFinished === false),

		concatMap(() => rawSubscription.send(message)),
	);

export const emitError: () => <T>(source: Observable<T>) => Observable<Error> = () => source =>
	source.pipe(
		// Skip every regular message. We only want to emit when there's an error
		skipUntil(NEVER),

		// When there's an error, catch it and emit it
		catchError(err => of(err)),

		shareReplay({ bufferSize: 1, refCount: true }),
	);
