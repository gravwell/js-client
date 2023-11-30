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
import { toRawUpdatableDashboard } from '~/models/dashboard/to-raw-updatable-dashboard';
import { UpdatableDashboard } from '~/models/dashboard/updatable-dashboard';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';
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
