/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeCreateOneUser } from '~/functions/users/create-one-user';
import { makeDeleteOneUser } from '~/functions/users/delete-one-user';
import { makeGetAllUsers } from '~/functions/users/get-all-users';
import { makeGetManyUsers } from '~/functions/users/get-many-users';
import { makeGetMyUser } from '~/functions/users/get-my-user';
import { makeGetOneUser } from '~/functions/users/get-one-user';
import { makeUpdateMyUser } from '~/functions/users/update-my-user';
import { makeUpdateOneUser } from '~/functions/users/update-one-user';
import { APIContext } from '~/functions/utils/api-context';
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
