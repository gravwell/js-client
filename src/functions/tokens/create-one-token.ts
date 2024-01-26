/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableToken } from '~/models/token/creatable-token';
import { RawTokenWithSecret } from '~/models/token/raw-token-with-secret';
import { toRawCreatableToken } from '~/models/token/to-raw-creatable-token';
import { toTokenWithSecret } from '~/models/token/to-token-with-secret';
import { TokenWithSecret } from '~/models/token/token-with-secret';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeCreateOneToken = (context: APIContext): ((data: CreatableToken) => Promise<TokenWithSecret>) => {
	const templatePath = '/api/tokens?admin=true';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (data: CreatableToken): Promise<TokenWithSecret> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawCreatableToken(data)),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<RawTokenWithSecret>(raw);
			return toTokenWithSecret(rawRes);
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};
