/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Dashboard, RawDashboard, toDashboard } from '../../models';
import { NumericID } from '../../value-objects';
import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';

export const makeGetOneDashboard = (context: APIContext) => {
	return async (dashboardID: NumericID): Promise<Dashboard> => {
		const templatePath = '/api/dashboards/{dashboardID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { dashboardID } });

		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawDashboard>(raw);
		return toDashboard(rawRes);
	};
};
