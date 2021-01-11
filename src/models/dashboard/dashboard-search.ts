import { NumericID, UUID } from '../../value-objects';
import { Timeframe } from '../timeframe';

export interface BaseDashboardSearch {
	name: string | null;
	timeframeOverride: Timeframe | null;
	cachedSearchID: NumericID | null;
	variablePreviewValue: string | null;
}

export type DashboardSearch = BaseDashboardSearch &
	(
		| { type: 'query'; query: string }
		| { type: 'template'; templateID: UUID }
		| { type: 'savedQuery'; savedQueryID: UUID }
		| { type: 'scheduledSearch'; scheduledSearchID: UUID }
	);
