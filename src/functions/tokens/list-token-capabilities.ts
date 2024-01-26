/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { TokenCapability } from '~/models/token/token-capability';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeListTokenCapabilities = (context: APIContext) => async (): Promise<Array<TokenCapability>> => {
	const templatePath = '/api/tokens/capabilities';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	const req = buildHTTPRequestWithAuthFromContext(context);

	const raw = await context.fetch(url, { ...req, method: 'GET' });
	const rawRes = await parseJSONResponse<Array<TokenCapability>>(raw);
	return rawRes;
};
