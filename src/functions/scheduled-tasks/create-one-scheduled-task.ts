/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableScheduledTask } from '~/models/scheduled-task/creatable-scheduled-task';
import { ScheduledQuery } from '~/models/scheduled-task/scheduled-query';
import { ScheduledScript } from '~/models/scheduled-task/scheduled-script';
import { ScheduledTask } from '~/models/scheduled-task/scheduled-task';
import { toRawCreatableScheduledTask } from '~/models/scheduled-task/to-raw-creatable-scheduled-task';
import { RawNumericID, toNumericID } from '~/value-objects/id';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';
import { makeGetOneScheduledTask } from './get-one-scheduled-task';

export const makeCreateOneScheduledTask = (
	context: APIContext,
): (<D extends CreatableScheduledTask>(
	data: D,
) => Promise<
	D['type'] extends 'query' ? ScheduledQuery : D['type'] extends 'script' ? ScheduledScript : ScheduledTask
>) => {
	const getOneScheduledTask = makeGetOneScheduledTask(context);

	const templatePath = '/api/scheduledsearches';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async <D extends CreatableScheduledTask>(
		data: D,
	): Promise<
		D['type'] extends 'query' ? ScheduledQuery : D['type'] extends 'script' ? ScheduledScript : ScheduledTask
	> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawCreatableScheduledTask(data)),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			const rawID = await parseJSONResponse<RawNumericID>(raw);
			const scheduledTaskID = toNumericID(rawID);

			const task: ScheduledTask = await getOneScheduledTask(scheduledTaskID);
			return task as any;
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};
