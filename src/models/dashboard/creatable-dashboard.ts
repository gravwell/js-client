/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID } from '~/value-objects';
import { CreatableTimeframe } from '../timeframe';
import { CreatableDashboardSearch } from './creatable-dashboard-search';
import { CreatableDashboardTile } from './creatable-dashboard-tile';
import { DashboardLiveUpdate } from './dashboard-live-update';

export interface CreatableDashboard {
	groupIDs?: Array<NumericID>;
	isGlobal?: boolean;

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
