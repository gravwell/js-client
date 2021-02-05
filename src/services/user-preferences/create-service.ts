/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {
	makeDeleteOneUserPreferences,
	makeGetAllUserPreferences,
	makeGetOneUserPreferences,
	makeUpdateOneUserPreferences,
} from '~/functions/user-preferences';
import { APIContext } from '~/functions/utils';
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
