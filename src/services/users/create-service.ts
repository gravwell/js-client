/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import {
	makeCreateOneUser,
	makeDeleteOneUser,
	makeGetAllUsers,
	makeGetManyUsers,
	makeGetMyUser,
	makeGetOneUser,
	makeUpdateMyUser,
	makeUpdateOneUser,
} from '~/functions/users';
import { APIContext } from '~/functions/utils';
import { UsersService } from './service';

export const createUsersService = (context: APIContext): UsersService => ({
	get: {
		me: makeGetMyUser(context),
		one: makeGetOneUser(context),
		many: makeGetManyUsers(context),
		all: makeGetAllUsers(context),
	},

	create: { one: makeCreateOneUser(context) },

	update: {
		me: makeUpdateMyUser(context),
		one: makeUpdateOneUser(context),
	},

	delete: {
		one: makeDeleteOneUser(context),
	},
});
