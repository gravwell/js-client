/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawSearchModule, SearchModule, toSearchModule } from '~/models';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetAllSearchModules = (context: APIContext): (() => Promise<Array<SearchModule>>) => {
	const templatePath = '/api/info/searchmodules';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<Array<SearchModule>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<RawResponse>(raw)) ?? [];
		return rawRes.map(toSearchModule);
	};
};

type RawResponse = null | Array<RawSearchModule>;
