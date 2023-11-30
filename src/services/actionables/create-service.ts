/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeCreateOneActionable } from '~/functions/actionables/create-one-actionable';
import { makeDeleteOneActionable } from '~/functions/actionables/delete-one-actionable';
import { makeGetAllActionables } from '~/functions/actionables/get-all-actionables';
import { makeGetAllActionablesAsAdmin } from '~/functions/actionables/get-all-actionables-as-admin';
import { makeGetOneActionable } from '~/functions/actionables/get-one-actionable';
import { makeUpdateOneActionable } from '~/functions/actionables/update-one-actionable';
import { APIContext } from '~/functions/utils/api-context';
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
