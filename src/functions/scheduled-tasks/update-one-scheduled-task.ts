/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {
	RawScheduledTask,
	ScheduledQuery,
	ScheduledScript,
	ScheduledTask,
	toRawUpdatableScheduledTask,
	toScheduledTask,
	UpdatableScheduledTask,
} from '~/models';
import {
	APIContext,
	buildHTTPRequestWithContextToken,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetOneScheduledTask } from './get-one-scheduled-task';

export const makeUpdateOneScheduledTask = (context: APIContext) => {
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
			};
			const req = buildHTTPRequestWithContextToken(context, baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'PUT' });
			const rawScheduledTask = await parseJSONResponse<RawScheduledTask>(raw);

			const task: ScheduledTask = toScheduledTask(rawScheduledTask);
			return task as any;
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};
