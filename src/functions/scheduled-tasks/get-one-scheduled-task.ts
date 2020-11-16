/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
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
	ScheduledTaskType,
	toScheduledTask,
} from '../../models';
import { NumericID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeGetOneScheduledTask = (makerOptions: APIFunctionMakerOptions) => {
	return async <Type extends ScheduledTaskType = ScheduledTaskType>(
		authToken: string | null,
		scheduledTaskID: NumericID,
	): Promise<Type extends 'query' ? ScheduledQuery : Type extends 'script' ? ScheduledScript : ScheduledTask> => {
		const templatePath = '/api/scheduledsearches/{scheduledTaskID}';
		const url = buildURL(templatePath, { ...makerOptions, protocol: 'http', pathParams: { scheduledTaskID } });

		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawScheduledTask>(raw);

		const task: ScheduledTask = await toScheduledTask(rawRes);
		return task as any;
	};
};
