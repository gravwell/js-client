/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { UserPreferences } from '~/models';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, fetch, parseJSONResponse } from '../utils';
import { ID, RawNumericID } from '../../value-objects/id';
import { decode as base64decode } from 'base-64';

export const makeGetAllUserPreferences = (context: APIContext) => {
	const templatePath = '/api/users/preferences';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<Array<UserPreferencesWithMetadata>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawUserPreferencesWithMetadata> | null>(raw)) ?? [];
		return rawRes.map(toUserPreferencesWithMetadata);
	};
};

interface RawUserPreferencesWithMetadata {
	Name: 'prefs';

	/** Base 64 encoded user preferences */
	Data: string;

	Synced: boolean;

	/** User ID of the owner of those preferences */
	UID: RawNumericID;

	/** Timestamp of the last update */
	Updated: string;
}

export interface UserPreferencesWithMetadata {
	/** User ID of the owner of those preferences */
	userID: ID;

	/** Date of the last update */
	lastUpdateDate: Date;

	/** User preferences */
	preferences: UserPreferences;
}

const toUserPreferencesWithMetadata = (raw: RawUserPreferencesWithMetadata): UserPreferencesWithMetadata => ({
	userID: raw.toString(),
	lastUpdateDate: new Date(raw.Updated),
	preferences: JSON.parse(base64decode(raw.Data)),
});
