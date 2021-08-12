/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, fetch, parseJSONResponse } from '../utils';

export const makeWebServerIsDistributed = (context: APIContext) => {
	const templatePath = '/api/distributed';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<boolean> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const rawRes = await fetch(url, { ...req, method: 'GET' });
		const rawData = await parseJSONResponse<RawDistributedWebServerResponse>(rawRes);
		return rawData.Distributed;
	};
};

interface RawDistributedWebServerResponse {
	Distributed: boolean;
}
