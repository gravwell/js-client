/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { decode as base64Decode } from 'base-64';
import { RawUserPreferencesWithMetadata } from './raw-user-preferences-with-metadata';
import { UserPreferencesWithMetadata } from './user-preferences-with-metadata';

export const toUserPreferencesWithMetadata = (raw: RawUserPreferencesWithMetadata): UserPreferencesWithMetadata => ({
	userID: raw.toString(),
	lastUpdateDate: new Date(raw.Updated),
	preferences: JSON.parse(base64Decode(raw.Data)),
});
