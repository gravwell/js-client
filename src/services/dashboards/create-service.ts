/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeCreateOneDashboard } from '~/functions/dashboards/create-one-dashboard';
import { makeDeleteOneDashboard } from '~/functions/dashboards/delete-one-dashboard';
import { makeGetAllDashboards } from '~/functions/dashboards/get-all-dashboards';
import { makeGetDashboardsAuthorizedToMe } from '~/functions/dashboards/get-dashboards-authorized-to-me';
import { makeGetManyDashboards } from '~/functions/dashboards/get-many-dashboards';
import { makeGetOneDashboard } from '~/functions/dashboards/get-one-dashboard';
import { makeImportOneDashboard } from '~/functions/dashboards/import-one-dashboard';
import { makeUpdateOneDashboard } from '~/functions/dashboards/update-one-dashboard';
import { APIContext } from '~/functions/utils/api-context';
import { DashboardsService } from './service';

export const createDashboardsService = (context: APIContext): DashboardsService => ({
	get: {
		one: makeGetOneDashboard(context),
		many: makeGetManyDashboards(context),
		all: makeGetAllDashboards(context),
		authorizedTo: {
			me: makeGetDashboardsAuthorizedToMe(context),
		},
	},

	create: {
		one: makeCreateOneDashboard(context),
	},

	update: {
		one: makeUpdateOneDashboard(context),
	},

	delete: {
		one: makeDeleteOneDashboard(context),
	},
	import: {
		one: makeImportOneDashboard(context),
	},
});
