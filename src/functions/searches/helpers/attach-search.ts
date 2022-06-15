import { filter, firstValueFrom, map, Observable } from 'rxjs';
import { DateRange } from '~/functions';
import { SearchFilter } from '~/main';
import { filterMessageByCommand, RequiredSearchFilter } from '../../searches/subscribe-to-one-search/helpers';
import { RawRequestSearchDetailsMessageSent } from '~/models';
import { SearchMessageCommands } from '~/models';
import { RawSearchMessageReceived } from '~/models';
import { APISubscription } from '~/functions/utils';
import { RawSearchMessageSent } from '~/models';
import { RawResponseForSearchStatsWithinRangeMessageReceived } from '~/models';
import { countEntriesFromModules } from '../../searches/subscribe-to-one-search/helpers';
import { isAfter } from 'date-fns';
import { SearchFrequencyStats, SearchStats } from '~/models';
import { RawResponseForSearchStatsMessageReceived, RawResponseForSearchDetailsMessageReceived } from '~/models';
import { isUndefined } from 'lodash';
import { toNumericID } from '../../../value-objects/id';
import { RawSearchAttachedMessageReceived } from '~/models';

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

export const extractZoomFromRawSearchStats: (
	props: Readonly<{
		filtersByID: Record<string, SearchFilter | undefined>;
		initialFilter: RequiredSearchFilter;
		previewDateRange: DateRange;
	}>,
) => (
	source: Observable<RawResponseForSearchStatsWithinRangeMessageReceived>,
) => Observable<{
	frequencyStats: Array<SearchFrequencyStats>;
	filter: SearchFilter | undefined;
}> = ({ filtersByID, initialFilter, previewDateRange }) => source =>
	source.pipe(
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
	);

export const mapToSearchStats: (
	props: Readonly<{
		filtersByID: Record<string, SearchFilter | undefined>;
		searchAttachMsg: RawSearchAttachedMessageReceived;
	}>,
) => (
	source: Observable<[RawResponseForSearchStatsMessageReceived, RawResponseForSearchDetailsMessageReceived]>,
) => Observable<SearchStats> = ({ filtersByID, searchAttachMsg }) => source =>
	source.pipe(
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
			},
		),
	);
