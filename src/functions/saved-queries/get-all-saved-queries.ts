/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawSavedQuery } from '~/models/saved-query/raw-saved-query';
import { SavedQuery } from '~/models/saved-query/saved-query';
import { toSavedQuery } from '~/models/saved-query/to-saved-query';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetAllSavedQueries = (context: APIContext): (() => Promise<Array<SavedQuery>>) => {
	const path = '/api/library?admin=true';
	const url = buildURL(path, { ...context, protocol: 'http' });

	return async (): Promise<Array<SavedQuery>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawSavedQuery> | null>(raw)) ?? [];
		return rawRes.map(toSavedQuery);
	};
};
