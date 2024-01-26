/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isNull, isNumber, isString } from 'lodash';
import { isNumericID } from '~/value-objects/id';
import { DashboardTile } from './dashboard-tile';
import { isDashboardRendererOptions } from './is-dashboard-renderer-options';

export const isDashboardTile = (value: unknown): value is DashboardTile => {
	try {
		const dt = value as DashboardTile;
		return (
			isNumericID(dt.id) &&
			isString(dt.title) &&
			(isNumber(dt.searchIndex) || (isString(dt.searchIndex) && Number.isInteger(parseInt(dt.searchIndex, 10)))) &&
			isString(dt.renderer) &&
			/** Due to the old dashboards we may not have `.rendererOptions` defined */
			(isNull(dt.rendererOptions) || isDashboardRendererOptions(dt.rendererOptions)) &&
			isNumber(dt.dimensions.columns) &&
			isNumber(dt.dimensions.rows) &&
			/** Due to the old dashboards we may not have `x` and `y` defined */
			(isNull(dt.position.x) || isNumber(dt.position.x)) &&
			(isNull(dt.position.y) || isNumber(dt.position.y))
		);
	} catch {
		return false;
	}
};
