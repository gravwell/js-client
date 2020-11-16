/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeLogoutOneUser = (makerOptions: APIFunctionMakerOptions) => {
	const templatePath = '/api/logout';
	const url = buildURL(templatePath, { ...makerOptions, protocol: 'http' });

	return async (userAuthToken: string): Promise<void> => {
		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: userAuthToken ? `Bearer ${userAuthToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'PUT' });
		return parseJSONResponse(raw);
	};
};
