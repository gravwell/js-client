/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { LocalKit } from '~/models/kit/local-kit';
import { RawLocalKit } from '~/models/kit/raw-local-kit';
import { toLocalKit } from '~/models/kit/to-local-kit';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetAllLocalKits = (context: APIContext): (() => Promise<Array<LocalKit>>) => {
	const path = '/api/kits';
	const url = buildURL(path, { ...context, protocol: 'http' });

	return async (): Promise<Array<LocalKit>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawLocalKit> | null>(raw)) ?? [];
		return rawRes.map(toLocalKit);
	};
};
