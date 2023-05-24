/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawSearch2, Search2, toSearch2 } from '~/models';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

export const makeGetAllPersistentSearchStatus = (context: APIContext): (() => Promise<Array<Search2>>) => {
	const templatePath = '/api/searchctrl?admin=true';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<Array<Search2>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<RawResponse>(raw)) ?? [];
		return rawRes.map(toSearch2);
	};
};

type RawResponse = null | Array<RawSearch2>;
