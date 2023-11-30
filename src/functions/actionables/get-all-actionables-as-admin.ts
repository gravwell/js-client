/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Actionable } from '~/models/actionable/actionable';
import { RawActionable } from '~/models/actionable/raw-actionable';
import { toActionable } from '~/models/actionable/to-actionable';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetAllActionablesAsAdmin = (context: APIContext): (() => Promise<Array<Actionable>>) => {
	const templatePath = '/api/pivots?admin=true';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<Array<Actionable>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawActionable> | null>(raw)) ?? [];
		return rawRes.map(toActionable);
	};
};
