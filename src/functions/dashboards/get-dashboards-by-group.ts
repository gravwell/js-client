/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Dashboard, RawDashboard, toDashboard } from '~/models';
import { NumericID } from '~/value-objects';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

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
