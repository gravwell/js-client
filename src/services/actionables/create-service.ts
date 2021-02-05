/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {
	makeCreateOneActionable,
	makeDeleteOneActionable,
	makeGetAllActionables,
	makeGetAllActionablesAsAdmin,
	makeGetOneActionable,
	makeUpdateOneActionable,
} from '~/functions/actionables';
import { APIContext } from '~/functions/utils';
import { ActionablesService } from './service';

export const createActionablesService = (context: APIContext): ActionablesService => ({
	get: {
		one: makeGetOneActionable(context),
		all: makeGetAllActionablesAsAdmin(context),
		authorizedTo: {
			me: makeGetAllActionables(context),
		},
	},

	create: {
		one: makeCreateOneActionable(context),
	},

	update: {
		one: makeUpdateOneActionable(context),
	},

	delete: {
		one: makeDeleteOneActionable(context),
	},
});
