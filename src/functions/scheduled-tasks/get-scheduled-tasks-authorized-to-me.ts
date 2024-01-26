/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawScheduledTask } from '~/models/scheduled-task/raw-scheduled-task';
import { ScheduledTask } from '~/models/scheduled-task/scheduled-task';
import { toScheduledTask } from '~/models/scheduled-task/to-scheduled-task';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetScheduledTasksAuthorizedToMe = (context: APIContext): (() => Promise<Array<ScheduledTask>>) => {
	const path = '/api/scheduledsearches';
	const url = buildURL(path, { ...context, protocol: 'http' });

	return async (): Promise<Array<ScheduledTask>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawScheduledTask> | null>(raw)) ?? [];
		return rawRes.map(toScheduledTask);
	};
};
