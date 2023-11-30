/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isBlankRawResource, RawResource, Resource, toResource } from '~/models';
import { UUID } from '~/value-objects';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetOneResource =
	(context: APIContext) =>
	async (resourceID: UUID): Promise<Resource> => {
		const resourcePath = '/api/resources/{resourceID}';
		const url = buildURL(resourcePath, { ...context, protocol: 'http', pathParams: { resourceID } });

		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawResource = await parseJSONResponse<RawResource>(raw);
		// gravwell/gravwell#2337 nº 3
		if (isBlankRawResource(rawResource)) {
			throw new Error('Not found');
		}
		return toResource(rawResource);
	};
