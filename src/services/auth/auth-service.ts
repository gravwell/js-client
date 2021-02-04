/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { UserSessions } from '../../models/user-sessions';

export interface AuthService {
	readonly login: {
		readonly one: (username: string, password: string) => Promise<string>;
	};

	readonly logout: {
		readonly one: (userAuthToken: string) => Promise<void>;
		readonly all: () => Promise<void>;
	};

	readonly get: {
		readonly many: {
			readonly activeSessions: ({ userID }: { userID: string }) => Promise<UserSessions>;
		};
	};
}
