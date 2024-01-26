/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { UpdatableDashboardTile } from '~/models/dashboard/updatable-dashboard-tile';
import { Version } from '~/models/version/version';
import { NumericID } from '~/value-objects/id';
import { CreatableTimeframe } from '../timeframe/creatable-timeframe';
import { CreatableDashboardSearch } from './creatable-dashboard-search';
import { DashboardLiveUpdate } from './dashboard-live-update';

export interface UpdatableDashboard {
	id: NumericID;
	groupIDs?: Array<NumericID>;
	isGlobal?: boolean;

	name?: string;
	description?: string | null;
	labels?: Array<string>;

	version?: Version;
	timeframe?: CreatableTimeframe;
	searches?: Array<CreatableDashboardSearch>;
	tiles?: Array<UpdatableDashboardTile>;

	updateOnZoom?: boolean;

	liveUpdate?: DashboardLiveUpdate;

	gridOptions?: {
		gutter?: number | null;
		margin?: number | null;
	};

	trivial?: boolean;
}
