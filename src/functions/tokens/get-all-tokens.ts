/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawToken } from '~/models/token/raw-token';
import { toToken } from '~/models/token/to-token';
import { Token } from '~/models/token/token';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetAllTokens = (context: APIContext): (() => Promise<Array<Token>>) => {
	const path = '/api/tokens?admin=true';
	const url = buildURL(path, { ...context, protocol: 'http' });

	return async (): Promise<Array<Token>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawToken> | null>(raw)) ?? [];
		return rawRes.map(toToken);
	};
};
