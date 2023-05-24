/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Dashboard, RawDashboard, toDashboard, toRawUpdatableDashboard, UpdatableDashboard } from '~/models';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetOneDashboard } from './get-one-dashboard';

export const makeUpdateOneDashboard = (
	context: APIContext,
): ((requestData: UpdatableDashboard) => Promise<Dashboard>) => {
	const getOneDashboard = makeGetOneDashboard(context);

	return async (requestData: UpdatableDashboard): Promise<Dashboard> => {
		const { trivial, ...data } = requestData;
		const templatePath = trivial ? `/api/dashboards/{dashboardID}?trivial=true` : '/api/dashboards/{dashboardID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { dashboardID: data.id } });

		try {
			const current = await getOneDashboard(data.id);

			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawUpdatableDashboard(data, current)),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'PUT' });
			const rawDashboard = await parseJSONResponse<RawDashboard>(raw);
			return toDashboard(rawDashboard);
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};
