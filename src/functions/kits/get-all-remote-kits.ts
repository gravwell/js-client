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
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetAllRemoteKits = (context: APIContext): (() => Promise<Array<RemoteKit>>) => {
	const path = '/api/kits/remote/list';
	const url = buildURL(path, { ...context, protocol: 'http' });

	return async (): Promise<Array<RemoteKit>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawRemoteKit> | null>(raw)) ?? [];
		return rawRes.map(toRemoteKit);
	};
};
