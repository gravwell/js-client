/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isArray, isBoolean, isDate, isNull, isNumber, isString } from 'lodash';
import { Dashboard, isTimeframe, isVersion } from '~/models';
import { isNumericID, isUUID } from '~/value-objects';
import { isDashboardLiveUpdate } from './is-dashboard-live-update';
import { isDashboardSearch } from './is-dashboard-search';
import { isDashboardTile } from './is-dashboard-tile';

export const isDashboard = (value: unknown): value is Dashboard => {
	try {
		const d = <Dashboard>value;
		return (
			isNumericID(d.id) &&
			isUUID(d.globalID) &&
			isNumericID(d.userID) &&
			isArray(d.groupIDs) &&
			d.groupIDs.every(isNumericID) &&
			isString(d.name) &&
			(isNull(d.description) || isString(d.description)) &&
			isArray(d.labels) &&
			d.labels.every(isString) &&
			isDate(d.creationDate) &&
			isDate(d.lastUpdateDate) &&
			isDate(d.lastMainUpdateDate) &&
			isVersion(d.version) &&
			isBoolean(d.updateOnZoom) &&
			isDashboardLiveUpdate(d.liveUpdate) &&
			isTimeframe(d.timeframe) &&
			isArray(d.searches) &&
			d.searches.every(isDashboardSearch) &&
			isArray(d.tiles) &&
			d.tiles.every(isDashboardTile) &&
			(isNull(d.gridOptions.gutter) || isNumber(d.gridOptions.gutter)) &&
			(isNull(d.gridOptions.margin) || isNumber(d.gridOptions.margin))
		);
	} catch {
		return false;
	}
};
