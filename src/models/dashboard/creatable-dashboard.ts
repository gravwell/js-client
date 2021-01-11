import { NumericID } from '../../value-objects';
import { CreatableTimeframe } from '../timeframe';
import { CreatableDashboardSearch } from './creatable-dashboard-search';
import { CreatableDashboardTile } from './creatable-dashboard-tile';
import { DashboardLiveUpdate } from './dashboard-live-update';

export interface CreatableDashboard {
	groupIDs?: Array<NumericID>;

	/**
	 * All uppercase and no spaces.
	 */
	name: string;
	description?: string | null;
	labels?: Array<string>;

	timeframe: CreatableTimeframe;
	searches: Array<CreatableDashboardSearch>;
	tiles: Array<CreatableDashboardTile>;

	updateOnZoom?: boolean;

	liveUpdate?: DashboardLiveUpdate;

	gridOptions?: {
		gutter?: number | null;
		margin?: number | null;
	};
}
