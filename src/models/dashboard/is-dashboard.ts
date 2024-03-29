/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Dashboard } from '~/models/dashboard/dashboard';
import { DATA_TYPE } from '~/models/data-type';
import { isDashboardData } from './is-dashboard-data';

export const isDashboard = (value: unknown): value is Dashboard => {
	try {
		const d = value as Dashboard;
		return d._tag === DATA_TYPE.DASHBOARD && isDashboardData(d);
	} catch {
		return false;
	}
};
