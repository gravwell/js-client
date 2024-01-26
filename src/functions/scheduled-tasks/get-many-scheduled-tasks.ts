/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { ScheduledTask } from '~/models/scheduled-task/scheduled-task';
import { isNumericID, NumericID } from '~/value-objects/id';
import { APIContext } from '../utils/api-context';
import { makeGetAllScheduledTasks } from './get-all-scheduled-tasks';
import { makeGetScheduledTasksByUser } from './get-scheduled-tasks-by-user';

export const makeGetManyScheduledTasks = (
	context: APIContext,
): ((filter?: ScheduledTasksFilter) => Promise<Array<ScheduledTask>>) => {
	const getScheduledTasksByUser = makeGetScheduledTasksByUser(context);
	const getAllScheduledTasks = makeGetAllScheduledTasks(context);

	return async (filter: ScheduledTasksFilter = {}): Promise<Array<ScheduledTask>> => {
		if (isNumericID(filter.userID)) {
			return getScheduledTasksByUser(filter.userID);
		}

		return getAllScheduledTasks();
	};
};

export interface ScheduledTasksFilter {
	userID?: NumericID;
}
