/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import {
	RawScheduledTask,
	ScheduledQuery,
	ScheduledScript,
	ScheduledTask,
	ScheduledTaskType,
	toScheduledTask,
} from '~/models';
import { NumericID } from '~/value-objects';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

export const makeGetOneScheduledTask =
	(context: APIContext) =>
	async <Type extends ScheduledTaskType = ScheduledTaskType>(
		scheduledTaskID: NumericID,
	): Promise<Type extends 'query' ? ScheduledQuery : Type extends 'script' ? ScheduledScript : ScheduledTask> => {
		const templatePath = '/api/scheduledsearches/{scheduledTaskID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { scheduledTaskID } });

		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawScheduledTask>(raw);

		const task: ScheduledTask = await toScheduledTask(rawRes);
		return task as any;
	};
