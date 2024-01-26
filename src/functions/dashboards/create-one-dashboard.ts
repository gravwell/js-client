/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableDashboard } from '~/models/dashboard/creatable-dashboard';
import { Dashboard } from '~/models/dashboard/dashboard';
import { toRawCreatableDashboard } from '~/models/dashboard/to-raw-creatable-dashboard';
import { RawNumericID, toNumericID } from '~/value-objects/id';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';
import { makeGetOneDashboard } from './get-one-dashboard';

export const makeCreateOneDashboard = (context: APIContext): ((data: CreatableDashboard) => Promise<Dashboard>) => {
	const getOneDashboard = makeGetOneDashboard(context);

	const templatePath = '/api/dashboards';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (data: CreatableDashboard): Promise<Dashboard> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawCreatableDashboard(data)),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<RawNumericID>(raw);
			const dashboardID = toNumericID(rawRes);
			return getOneDashboard(dashboardID);
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};
