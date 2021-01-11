import { NumericID, UUID } from '../../value-objects';
import { Timeframe } from '../timeframe';
import { Version } from '../version';
import { DashboardSearch } from './dashboard-search';
import { DashboardLiveUpdate, DashboardTile } from './index';

export interface Dashboard {
	id: NumericID;
	globalID: UUID;

	userID: NumericID;
	groupIDs: Array<NumericID>;

	name: string;
	description: string | null;
	labels: Array<string>;

	creationDate: Date;
	lastUpdateDate: Date;
	/**
	 * Date of the last update to the dashboard contents, not including name,
	 * description, labels, userID and groupIDs
	 */
	lastMainUpdateDate: Date;

	version: Version;

	/**
	 * Update all tiles when zooming.
	 */
	updateOnZoom: boolean;

	liveUpdate: DashboardLiveUpdate;

	timeframe: Timeframe;

	searches: Array<DashboardSearch>;

	tiles: Array<DashboardTile>;

	gridOptions: {
		gutter: number | null;
		margin: number | null;
	};
}
