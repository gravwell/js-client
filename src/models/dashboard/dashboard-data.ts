/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID, UUID } from '~/value-objects';
import { Timeframe } from '../timeframe';
import { Version } from '../version';
import { DashboardSearch } from './dashboard-search';
import { DashboardLiveUpdate, DashboardTile } from './index';

export interface DashboardData {
	id: NumericID;
	globalID: UUID | null;

	userID: NumericID;
	groupIDs: Array<NumericID>;
	isGlobal: boolean;

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

	/** Legacy support: `timeframe` may be undefined. */
	timeframe?: Timeframe;

	searches: Array<DashboardSearch>;

	tiles: Array<DashboardTile>;

	gridOptions: {
		gutter: number | null;
		margin: number | null;
	};
}
