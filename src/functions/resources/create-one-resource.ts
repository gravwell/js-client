/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableResource } from '~/models/resource/creatable-resource';
import { RawResource } from '~/models/resource/raw-resource';
import { Resource } from '~/models/resource/resource';
import { toRawCreatableResource } from '~/models/resource/to-raw-creatable-resource';
import { toResource } from '~/models/resource/to-resource';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeCreateOneResource = (context: APIContext): ((data: CreatableResource) => Promise<Resource>) => {
	const resourcePath = '/api/resources';
	const url = buildURL(resourcePath, { ...context, protocol: 'http' });

	return async (data: CreatableResource): Promise<Resource> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawCreatableResource(data)),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<RawResource>(raw);
			return toResource(rawRes);
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};
