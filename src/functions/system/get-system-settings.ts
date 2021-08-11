/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawSystemSettings, SystemSettings, toSystemSettings } from '~/models';
import { APIContext, buildHTTPRequestWithContextToken, buildURL, fetch, parseJSONResponse } from '../utils';

export const makeGetSystemSettings = (context: APIContext) => {
	const templatePath = '/api/settings';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<SystemSettings> => {
		const req = buildHTTPRequestWithContextToken(context);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawSystemSettings>(raw);
		return toSystemSettings(rawRes);
	};
};
