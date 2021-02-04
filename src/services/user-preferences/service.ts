/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { UserPreferences } from '../../models';

export interface UserPreferencesService {
	readonly get: {
		readonly one: (userID: string) => Promise<UserPreferences>;
		readonly all: () => Promise<Array<UserPreferences>>;
	};

	readonly update: {
		readonly one: (userID: string) => Promise<UserPreferences>;
	};

	readonly delete: {
		readonly one: (userID: string) => Promise<void>;
	};
}
