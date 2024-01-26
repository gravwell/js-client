/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { UserPreferences } from '~/models/user-preferences/user-preferences';
import { UserPreferencesWithMetadata } from '~/models/user-preferences/user-preferences-with-metadata';
import { NumericID } from '../../value-objects/id';

export interface UserPreferencesService {
	readonly get: {
		readonly one: (userID: NumericID) => Promise<UserPreferences>;
		readonly all: () => Promise<Array<UserPreferencesWithMetadata>>;
	};

	readonly update: {
		readonly one: (userID: NumericID, preferences: UserPreferences) => Promise<void>;
	};

	readonly delete: {
		readonly one: (userID: NumericID) => Promise<void>;
	};
}
