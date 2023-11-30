/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawRemoteKit } from '~/models/kit/raw-remote-kit';
import { RemoteKit } from '~/models/kit/remote-kit';
import { toRemoteKit } from '~/models/kit/to-remote-kit';
import { ID } from '~/value-objects';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeUploadOneRemoteKit =
	(context: APIContext) =>
	async (kitID: ID): Promise<RemoteKit> => {
		const resourcePath = '/api/kits';
		const url = buildURL(resourcePath, { ...context, protocol: 'http' });

		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify({ remote: kitID }),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<RawRemoteKit>(raw);
			return toRemoteKit(rawRes);
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
