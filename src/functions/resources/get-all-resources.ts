/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawResource } from '~/models/resource/raw-resource';
import { Resource } from '~/models/resource/resource';
import { toResource } from '~/models/resource/to-resource';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetAllResources = (context: APIContext): (() => Promise<Array<Omit<Resource, 'body'>>>) => {
	const resourcePath = '/api/resources?admin=true';
	const url = buildURL(resourcePath, { ...context, protocol: 'http' });

	return async (): Promise<Array<Omit<Resource, 'body'>>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawResource> | null>(raw)) ?? [];
		return rawRes.map(toResource);
	};
};
