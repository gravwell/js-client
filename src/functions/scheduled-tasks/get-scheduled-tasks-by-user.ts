/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawScheduledTask, ScheduledTask, toScheduledTask } from '../../models';
import { NumericID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeGetScheduledTasksByUser = (makerOptions: APIFunctionMakerOptions) => {
	return async (authToken: string | null, userID: NumericID): Promise<Array<ScheduledTask>> => {
		const path = '/api/scheduledsearches/user/{userID}';
		const url = buildURL(path, { ...makerOptions, protocol: 'http', pathParams: { userID } });

		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawScheduledTask> | null>(raw)) ?? [];
		return rawRes.map(toScheduledTask);
	};
};
