/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawUserPreferencesWithMetadata, toUserPreferencesWithMetadata, UserPreferencesWithMetadata } from '~/models';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetAllUserPreferences = (context: APIContext): (() => Promise<Array<UserPreferencesWithMetadata>>) => {
	const templatePath = '/api/users/preferences';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<Array<UserPreferencesWithMetadata>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = ((await parseJSONResponse<Array<RawUserPreferencesWithMetadata> | null>(raw)) ?? []).filter(
			// There are other things that come here, like email preferences for example. We need to make sure we're only getting the user preferences
			v => v.Name === 'prefs',
		);
		return rawRes.map(toUserPreferencesWithMetadata);
	};
};
