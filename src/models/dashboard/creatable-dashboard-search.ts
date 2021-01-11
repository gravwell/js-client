import { UUID } from '../../value-objects';
import { BaseDashboardSearch } from './dashboard-search';

export type CreatableDashboardSearch = Partial<BaseDashboardSearch> &
	(
		| { type: 'query'; query: string }
		| { type: 'template'; templateID: UUID }
		| { type: 'savedQuery'; savedQueryID: UUID }
		| { type: 'scheduledSearch'; scheduledSearchID: UUID }
	);
