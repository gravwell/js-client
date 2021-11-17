/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

export const makeSystemIsConnected = (context: APIContext) => {
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
