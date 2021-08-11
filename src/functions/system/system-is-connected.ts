/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { APIContext, buildHTTPRequestWithContextToken, buildURL, fetch, parseJSONResponse } from '../utils';

export const makeSystemIsConnected = (context: APIContext) => {
	const templatePath = '/api/test';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<boolean> => {
		const req = buildHTTPRequestWithContextToken(context);

		try {
			const rawRes = await fetch(url, { ...req, method: 'GET' });
			await parseJSONResponse(rawRes, { expect: 'void' });
			return true;
		} catch {
			return false;
		}
	};
};
