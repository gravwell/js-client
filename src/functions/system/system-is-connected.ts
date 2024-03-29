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

export const makeSystemIsConnected = (context: APIContext): (() => Promise<boolean>) => {
	const templatePath = '/api/test';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<boolean> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		try {
			const rawRes = await context.fetch(url, { ...req, method: 'GET' });
			await parseJSONResponse(rawRes, { expect: 'void' });
			return true;
		} catch {
			return false;
		}
	};
};
