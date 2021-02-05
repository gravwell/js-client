/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {
	makeCreateOneDashboard,
	makeDeleteOneDashboard,
	makeGetAllDashboards,
	makeGetDashboardsAuthorizedToMe,
	makeGetManyDashboards,
	makeGetOneDashboard,
	makeUpdateOneDashboard,
} from '~/functions/dashboards';
import { APIContext } from '~/functions/utils';
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
});
