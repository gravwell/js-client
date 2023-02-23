/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { ID } from '~/value-objects';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse, QueryParams } from '../utils';

export const makeUninstallOneKit =
	(context: APIContext) =>
	async (kitID: ID, force: boolean): Promise<void> => {
		// Filter out non-true query params.
		const queryParams: QueryParams = Object.fromEntries(Object.entries({ force }).filter(([, value]) => value));

		const path = '/api/kits/{kitID}';
		const url = buildURL(path, { ...context, protocol: 'http', pathParams: { kitID }, queryParams });

		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'DELETE' });
		return parseJSONResponse(raw, { expect: 'void' });
	};
