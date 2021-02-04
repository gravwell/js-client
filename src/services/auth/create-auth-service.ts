/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {
	makeGetOneUserActiveSessions,
	makeLoginOneUser,
	makeLogoutAllUsers,
	makeLogoutOneUser,
} from '../../functions/auth';
import { APIContext } from '../../functions/utils';
import { AuthService } from './auth-service';

export const createAuthService = (context: APIContext): AuthService => ({
	login: {
		one: makeLoginOneUser(context),
	},

	logout: {
		one: makeLogoutOneUser(context),
		all: makeLogoutAllUsers(context),
	},

	get: {
		many: {
			activeSessions: ({ userID }: { userID: string }) => makeGetOneUserActiveSessions(context)(userID),
		},
	},
});
