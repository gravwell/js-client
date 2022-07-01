/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID } from '~/value-objects';
import { CreatableTimeframe } from '../timeframe';
import { Version } from '../version';
import { CreatableDashboardSearch } from './creatable-dashboard-search';
import { DashboardLiveUpdate } from './dashboard-live-update';
import { DashboardTile } from './dashboard-tile';

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
	tiles?: Array<DashboardTile>;

	updateOnZoom?: boolean;

	liveUpdate?: DashboardLiveUpdate;

	gridOptions?: {
		gutter?: number | null;
		margin?: number | null;
	};
}
