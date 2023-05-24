/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeGetOneDashboard } from '~/functions/dashboards/get-one-dashboard';
import { Dashboard } from '~/models';
import { NumericID, RawNumericID, toNumericID } from '~/value-objects';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

export const makeImportOneDashboard = (context: APIContext): ((dashboardJSON: NumericID) => Promise<Dashboard>) => {
	const getOneDashboard = makeGetOneDashboard(context);

	return async (dashboardJSON: NumericID): Promise<Dashboard> => {
		const templatePath = '/api/import/{dashboardJSON}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { dashboardJSON } });

		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' }); // TODO (backend): should it be a post?
		const rawRes = await parseJSONResponse<RawNumericID>(raw);

		const dashboardID = toNumericID(rawRes);
		return getOneDashboard(dashboardID);
	};
};
