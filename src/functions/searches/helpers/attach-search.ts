import { filter, firstValueFrom, Observable } from 'rxjs';
import { DateRange } from '~/functions';
import { SearchFilter } from '~/main';
import { filterMessageByCommand, RequiredSearchFilter } from '../../searches/subscribe-to-one-search/helpers';
import { RawRequestSearchDetailsMessageSent } from '~/models';
import { SearchMessageCommands } from '~/models';
import { RawSearchMessageReceived } from '~/models';
import { APISubscription } from '~/functions/utils';
import { RawSearchMessageSent } from '~/models';

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
