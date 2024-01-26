/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawScheduledTask } from '~/models/scheduled-task/raw-scheduled-task';
import { ScheduledQuery } from '~/models/scheduled-task/scheduled-query';
import { ScheduledScript } from '~/models/scheduled-task/scheduled-script';
import { ScheduledTask } from '~/models/scheduled-task/scheduled-task';
import { toRawUpdatableScheduledTask } from '~/models/scheduled-task/to-raw-updatable-scheduled-task';
import { toScheduledTask } from '~/models/scheduled-task/to-scheduled-task';
import { UpdatableScheduledTask } from '~/models/scheduled-task/updatable-scheduled-task';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';
import { makeGetOneScheduledTask } from './get-one-scheduled-task';

export const makeUpdateOneScheduledTask = (
	context: APIContext,
): (<D extends UpdatableScheduledTask>(
	data: D,
) => Promise<
	D['type'] extends 'query' ? ScheduledQuery : D['type'] extends 'script' ? ScheduledScript : ScheduledTask
>) => {
	const getOneScheduledTask = makeGetOneScheduledTask(context);

	return async <D extends UpdatableScheduledTask>(
		data: D,
	): Promise<
		D['type'] extends 'query' ? ScheduledQuery : D['type'] extends 'script' ? ScheduledScript : ScheduledTask
	> => {
		const templatePath = '/api/scheduledsearches/{scheduledTaskID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { scheduledTaskID: data.id } });

		try {
			const current = await getOneScheduledTask(data.id);

			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawUpdatableScheduledTask(data, current)),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'PUT' });
			const rawScheduledTask = await parseJSONResponse<RawScheduledTask>(raw);

			const task: ScheduledTask = toScheduledTask(rawScheduledTask);
			return task as any;
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};
