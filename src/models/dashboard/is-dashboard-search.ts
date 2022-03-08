/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNull, isString } from 'lodash';
import { isTimeframe } from '~/models';
import { isNumericID } from '~/value-objects';
import { DashboardSearch } from './dashboard-search';

export const isDashboardSearch = (value: unknown): value is DashboardSearch => {
	try {
		const ds = <DashboardSearch>value;
		return (
			(isString(ds.name) || isNull(ds.name)) &&
			(isTimeframe(ds.timeframeOverride) || isNull(ds.timeframeOverride)) &&
			(isNumericID(ds.cachedSearchID) || isNull(ds.cachedSearchID)) &&
			(isString(ds.variablePreviewValue) || isNull(ds.variablePreviewValue))
		);
	} catch {
		return false;
	}
};
