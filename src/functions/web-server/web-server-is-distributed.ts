/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeWebServerIsDistributed = (context: APIContext): (() => Promise<boolean>) => {
	const templatePath = '/api/distributed';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<boolean> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const rawRes = await context.fetch(url, { ...req, method: 'GET' });
		const rawData = await parseJSONResponse<RawDistributedWebServerResponse>(rawRes);
		return rawData.Distributed;
	};
};

interface RawDistributedWebServerResponse {
	Distributed: boolean;
}
