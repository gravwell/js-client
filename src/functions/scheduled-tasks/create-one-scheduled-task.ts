/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {
	CreatableScheduledTask,
	ScheduledQuery,
	ScheduledScript,
	ScheduledTask,
	toRawCreatableScheduledTask,
} from '~/models';
import { RawNumericID, toNumericID } from '~/value-objects';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetOneScheduledTask } from './get-one-scheduled-task';

export const makeCreateOneScheduledTask = (context: APIContext) => {
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
