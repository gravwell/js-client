/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeDeleteOneUserPreferences } from '~/functions/user-preferences/delete-one-user-preferences';
import { makeGetAllUserPreferences } from '~/functions/user-preferences/get-all-user-preferences';
import { makeGetOneUserPreferences } from '~/functions/user-preferences/get-one-user-preferences';
import { makeUpdateOneUserPreferences } from '~/functions/user-preferences/update-one-user-preferences';
import { APIContext } from '~/functions/utils/api-context';
import { UserPreferencesService } from './service';

export const createUserPreferencesService = (context: APIContext): UserPreferencesService => ({
	get: {
		one: makeGetOneUserPreferences(context),
		all: makeGetAllUserPreferences(context),
	},

	update: {
		one: makeUpdateOneUserPreferences(context),
	},

	delete: {
		one: makeDeleteOneUserPreferences(context),
	},
});
