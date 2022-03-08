/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNumber, isString } from 'lodash';
import { isNumericID } from '~/value-objects';
import { DashboardTile } from './dashboard-tile';
import { isDashboardRendererOptions } from './is-dashboard-renderer-options';

export const isDashboardTile = (value: unknown): value is DashboardTile => {
	try {
		const dt = <DashboardTile>value;
		return (
			isNumericID(dt.id) &&
			isString(dt.title) &&
			isNumber(dt.searchIndex) &&
			isString(dt.renderer) &&
			isDashboardRendererOptions(dt.rendererOptions) &&
			isNumber(dt.dimensions.columns) &&
			isNumber(dt.dimensions.rows) &&
			isNumber(dt.position.x) &&
			isNumber(dt.position.y)
		);
	} catch {
		return false;
	}
};
