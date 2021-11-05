/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableDashboard, Dashboard, toRawCreatableDashboard } from '~/models';
import { RawNumericID, toNumericID } from '~/value-objects';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetOneDashboard } from './get-one-dashboard';

export const makeCreateOneDashboard = (context: APIContext) => {
	const getOneDashboard = makeGetOneDashboard(context);

	const templatePath = '/api/dashboards';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (data: CreatableDashboard): Promise<Dashboard> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawCreatableDashboard(data)),
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<RawNumericID>(raw);
			const dashboardID = toNumericID(rawRes);
			return getOneDashboard(dashboardID);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};
