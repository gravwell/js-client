/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ID } from '~/value-objects';
import { UserPreferences } from './user-preferences';

export interface UserPreferencesWithMetadata {
	/** User ID of the owner of those preferences */
	userID: ID;

	/** Date of the last update */
	lastUpdateDate: Date;

	/** User preferences */
	preferences: UserPreferences;
}
