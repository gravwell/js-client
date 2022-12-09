/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Dashboard, RawDashboard, toDashboard } from '~/models';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

export const makeGetAllDashboards = (context: APIContext) => {
	const path = '/api/dashboards/all';
	const url = buildURL(path, { ...context, protocol: 'http' });

	return async (): Promise<Array<Dashboard>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawDashboard> | null>(raw)) ?? [];
		return rawRes.map(toDashboard);
	};
};
