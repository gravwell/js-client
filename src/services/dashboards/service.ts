/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { DashboardsFilter } from '~/functions/dashboards/get-many-dashboards';
import { CreatableDashboard } from '~/models/dashboard/creatable-dashboard';
import { Dashboard } from '~/models/dashboard/dashboard';
import { UpdatableDashboard } from '~/models/dashboard/updatable-dashboard';

export interface DashboardsService {
	readonly get: {
		readonly one: (dashboardID: string) => Promise<Dashboard>;
		readonly many: (filter?: DashboardsFilter) => Promise<Array<Dashboard>>;
		readonly all: () => Promise<Array<Dashboard>>;
		readonly authorizedTo: {
			readonly me: () => Promise<Array<Dashboard>>;
		};
	};

	readonly create: {
		readonly one: (data: CreatableDashboard) => Promise<Dashboard>;
	};

	readonly update: {
		readonly one: (data: UpdatableDashboard) => Promise<Dashboard>;
	};

	readonly delete: {
		readonly one: (dashboardID: string) => Promise<void>;
	};

	readonly import: {
		readonly one: (dashboardJSON: string) => Promise<Dashboard>;
	};
}
