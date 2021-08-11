/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawScheduledTask, ScheduledTask, toScheduledTask } from '~/models';
import { NumericID } from '~/value-objects';
import { APIContext, buildHTTPRequestWithContextToken, buildURL, fetch, parseJSONResponse } from '../utils';

export const makeGetScheduledTasksByUser = (context: APIContext) => {
	return async (userID: NumericID): Promise<Array<ScheduledTask>> => {
		const path = '/api/scheduledsearches/user/{userID}';
		const url = buildURL(path, { ...context, protocol: 'http', pathParams: { userID } });

		const req = buildHTTPRequestWithContextToken(context);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawScheduledTask> | null>(raw)) ?? [];
		return rawRes.map(toScheduledTask);
	};
};
