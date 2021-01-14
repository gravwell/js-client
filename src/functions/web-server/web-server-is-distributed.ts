/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';

export const makeWebServerIsDistributed = (context: APIContext) => {
	const templatePath = '/api/distributed';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<boolean> => {
		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const rawRes = await fetch(url, { ...req, method: 'GET' });
		const rawData = await parseJSONResponse<RawDistributedWebServerResponse>(rawRes);
		return rawData.Distributed;
	};
};

interface RawDistributedWebServerResponse {
	Distributed: boolean;
}
