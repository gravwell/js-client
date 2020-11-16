/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ScheduledTask } from '../../models';
import { isNumericID, NumericID } from '../../value-objects';
import { APIFunctionMakerOptions } from '../utils';
import { makeGetAllScheduledTasks } from './get-all-scheduled-tasks';
import { makeGetScheduledTasksByUser } from './get-scheduled-tasks-by-user';

export const makeGetManyScheduledTasks = (makerOptions: APIFunctionMakerOptions) => {
	const getScheduledTasksByUser = makeGetScheduledTasksByUser(makerOptions);
	const getAllScheduledTasks = makeGetAllScheduledTasks(makerOptions);

	return async (authToken: string | null, filter: ScheduledTasksFilter = {}): Promise<Array<ScheduledTask>> => {
		if (isNumericID(filter.userID)) return getScheduledTasksByUser(authToken, filter.userID);

		return getAllScheduledTasks(authToken);
	};
};

export interface ScheduledTasksFilter {
	userID?: NumericID;
}
