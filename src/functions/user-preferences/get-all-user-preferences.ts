/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { UserPreferences } from '../../models';
import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';

export const makeGetAllUserPreferences = (context: APIContext) => async (): Promise<Array<UserPreferences>> => {
	const templatePath = '/api/users/preferences';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });
	const baseRequestOptions: HTTPRequestOptions = {
		headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
	};
	const req = buildHTTPRequest(baseRequestOptions);

	const raw = await fetch(url, { ...req, method: 'GET' });
	return parseJSONResponse(raw);
};
