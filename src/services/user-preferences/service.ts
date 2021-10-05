/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { UserPreferences } from '~/models';
import { NumericID } from '../../value-objects';
import { ID } from '../../value-objects/id';

export interface UserPreferencesService {
	readonly get: {
		readonly one: (userID: NumericID) => Promise<UserPreferences>;
		readonly all: () => Promise<Array<{ userID: ID; lastUpdateDate: Date; preferences: UserPreferences }>>;
	};

	readonly update: {
		readonly one: (userID: NumericID, preferences: UserPreferences) => Promise<void>;
	};

	readonly delete: {
		readonly one: (userID: NumericID) => Promise<void>;
	};
}
