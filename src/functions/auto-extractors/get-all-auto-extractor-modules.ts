/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

export const makeGetAllAutoExtractorModules = (context: APIContext): (() => Promise<Array<string>>) => {
	const path = '/api/autoextractors/engines';
	const url = buildURL(path, { ...context, protocol: 'http' });

	return async (): Promise<Array<string>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<string> | null>(raw)) ?? [];
		return rawRes;
	};
};
