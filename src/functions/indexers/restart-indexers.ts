/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

// TODO: Test this when gravwell/gravwell#2277 gets fixed
export const makeRestartIndexers = (context: APIContext): (() => Promise<void>) => {
	const templatePath = '/api/restart/indexers';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<void> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'POST' });
		return parseJSONResponse(raw, { expect: 'void' });
	};
};
