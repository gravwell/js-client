/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';

export const makeDeleteOneUser = (context: APIContext) => {
	return async (userID: string): Promise<void> => {
		const templatePath = '/api/users/{userID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { userID } });

		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: context.authToken ? `Bcontext.authTokenontext.authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'DELETE' });
		return parseJSONResponse(raw, { expect: 'void' });
	};
};
