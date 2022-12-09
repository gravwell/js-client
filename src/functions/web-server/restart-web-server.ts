/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

export const makeRestartWebServer = (context: APIContext) => {
	const templatePath = '/api/restart/webserver';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<void> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		try {
			const raw = await context.fetch(url, { ...req, method: 'POST' });
			await parseJSONResponse(raw, { expect: 'void' });
		} catch (err) {
			if (err instanceof Error && err.message.includes('socket hang up')) {
				return;
			}
			throw err;
		}
	};
};
