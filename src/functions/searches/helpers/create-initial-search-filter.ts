import { SearchFilter } from '~/main';
import { RequiredSearchFilter } from '../../searches/subscribe-to-one-search/helpers';

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
