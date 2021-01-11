import { NumericID } from '../../value-objects';
import { CreatableTimeframe } from '../timeframe';
import { Version } from '../version';
import { CreatableDashboardSearch } from './creatable-dashboard-search';
import { DashboardLiveUpdate } from './dashboard-live-update';
import { DashboardTile } from './dashboard-tile';

export interface UpdatableDashboard {
	id: NumericID;
	groupIDs?: Array<NumericID>;

	name?: string;
	description?: string | null;
	labels?: Array<string>;

	version?: Version;
	timeframe?: CreatableTimeframe;
	searches?: Array<CreatableDashboardSearch>;
	tiles?: Array<DashboardTile>;

	updateOnZoom?: boolean;

	liveUpdate?: DashboardLiveUpdate;

	gridOptions?: {
		gutter?: number | null;
		margin?: number | null;
	};
}
