/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeGetOneUserActiveSessions } from '~/functions/auth/get-one-user-active-sessions';
import { makeLoginOneUser } from '~/functions/auth/login-one-user';
import { makeLogoutAllUsers } from '~/functions/auth/logout-all-users';
import { makeLogoutOneUser } from '~/functions/auth/logout-one-user';
import { APIContext } from '~/functions/utils/api-context';
import { AuthService } from './service';

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
