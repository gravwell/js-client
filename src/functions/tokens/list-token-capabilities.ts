/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { TokenCapability } from '~/models';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

export const makeListTokenCapabilities = (context: APIContext) => {
	return async (): Promise<Array<TokenCapability>> => {
		const templatePath = '/api/tokens/capabilities';
		const url = buildURL(templatePath, { ...context, protocol: 'http' });

		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<Array<TokenCapability>>(raw);
		return rawRes;
	};
};
