/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';

export const makeDeleteOneUserPreferences = (context: APIContext) => async (
	sessionToken: string | null,
	userID: string,
): Promise<void> => {
	const templatePath = '/api/users/{userID}/preferences';
	const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { userID } });
	const baseRequestOptions: HTTPRequestOptions = {
		headers: { Authorization: sessionToken ? `Bearer ${sessionToken}` : undefined },
	};
	const req = buildHTTPRequest(baseRequestOptions);

	const raw = await fetch(url, { ...req, method: 'DELETE' });
	return parseJSONResponse(raw);
};
