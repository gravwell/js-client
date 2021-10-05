/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawUserPreferencesWithMetadata, toUserPreferencesWithMetadata, UserPreferencesWithMetadata } from '~/models';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, fetch, parseJSONResponse } from '../utils';

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
