/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { APIContext, buildHTTPRequestWithAuth, buildURL, parseJSONResponse } from '../utils';

export const makeLogoutOneUser = (context: APIContext) => {
	const templatePath = '/api/logout';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (userAuthToken: string): Promise<void> => {
		const req = buildHTTPRequestWithAuth(userAuthToken);

		const raw = await context.fetch(url, { ...req, method: 'PUT' });
		return parseJSONResponse(raw);
	};
};
