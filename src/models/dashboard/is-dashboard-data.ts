/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isArray, isBoolean, isDate, isNull, isNumber, isString, isUndefined } from 'lodash';
import { DashboardData } from '~/models/dashboard/dashboard-data';
import { isTimeframe } from '~/models/timeframe/is-timeframe';
import { isVersion } from '~/models/version/is-version';
import { isNumericID, isUUID } from '~/value-objects/id';
import { isDashboardLiveUpdate } from './is-dashboard-live-update';
import { isDashboardSearch } from './is-dashboard-search';
import { isDashboardTile } from './is-dashboard-tile';

export const isDashboardData = (value: unknown): value is DashboardData => {
	try {
		const d = value as DashboardData;

		return (
			isNumericID(d.id) &&
			(isNull(d.globalID) || isUUID(d.globalID)) &&
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
			(isUndefined(d.timeframe) || isTimeframe(d.timeframe)) &&
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
