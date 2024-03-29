/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Dashboard } from '~/models/dashboard/dashboard';
import { RawDashboard } from '~/models/dashboard/raw-dashboard';
import { toDashboard } from '~/models/dashboard/to-dashboard';
import { NumericID } from '~/value-objects/id';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetDashboardsByGroup =
	(context: APIContext) =>
	async (groupID: NumericID): Promise<Array<Dashboard>> => {
		const path = '/api/groups/{groupID}/dashboards';
		const url = buildURL(path, { ...context, protocol: 'http', pathParams: { groupID } });

		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawDashboard> | null>(raw)) ?? [];
		return rawRes.map(toDashboard);
	};
