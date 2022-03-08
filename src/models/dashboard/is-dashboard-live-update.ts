/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNil, isNumber } from 'lodash';
import { DashboardLiveUpdate } from './dashboard-live-update';

export const isDashboardLiveUpdate = (value: unknown): value is DashboardLiveUpdate => {
	try {
		const d = <DashboardLiveUpdate>value;
		return (d.enabled === true && isNumber(d.interval)) || (d.enabled === false && isNil(d.interval));
	} catch {
		return false;
	}
};
