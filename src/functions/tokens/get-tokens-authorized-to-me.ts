/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawToken, Token, toToken } from '~/models';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

export const makeGetTokensAuthorizedToMe = (context: APIContext) => {
	const path = '/api/tokens';
	const url = buildURL(path, { ...context, protocol: 'http' });

	return async (): Promise<Array<Token>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawToken> | null>(raw)) ?? [];
		return rawRes.map(toToken);
	};
};
