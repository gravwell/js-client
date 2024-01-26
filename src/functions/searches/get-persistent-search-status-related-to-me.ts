/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawSearch2 } from '~/models/search/raw-search2';
import { Search2 } from '~/models/search/search2';
import { toSearch2 } from '~/models/search/to-search2';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetPersistentSearchStatusRelatedToMe = (context: APIContext): (() => Promise<Array<Search2>>) => {
	const templatePath = '/api/searchctrl';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<Array<Search2>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<RawResponse>(raw)) ?? [];
		return rawRes.map(toSearch2);
	};
};

type RawResponse = null | Array<RawSearch2>;
