/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawToken, Token, toToken } from '~/models';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

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
