/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { ScheduledQuery } from '~/models/scheduled-task/scheduled-query';
import { ScheduledTask } from '~/models/scheduled-task/scheduled-task';
import { APIContext } from '../utils/api-context';
import { makeGetAllScheduledTasks } from './get-all-scheduled-tasks';

const isScheduledQuery = (s: ScheduledTask): s is ScheduledQuery => s.type === 'query';

export const makeGetAllScheduledQueries = (context: APIContext): (() => Promise<Array<ScheduledQuery>>) => {
	const getAllScheduledTasks = makeGetAllScheduledTasks(context);

	return async (): Promise<Array<ScheduledQuery>> => {
		const scheduledTasks = await getAllScheduledTasks();
		return scheduledTasks.filter(isScheduledQuery);
	};
};
