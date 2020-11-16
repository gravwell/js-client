/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { APIFunctionMakerOptions } from '../utils';
import { makeDeleteScheduledTasksByUser } from './delete-scheduled-tasks-by-user';
import { ScheduledTasksFilter } from './get-many-scheduled-tasks';

export const makeDeleteManyScheduledTasks = (makerOptions: APIFunctionMakerOptions) => {
	const deleteScheduledTasksByUser = makeDeleteScheduledTasksByUser(makerOptions);

	return async (authToken: string | null, filter: Required<ScheduledTasksFilter>): Promise<void> => {
		return deleteScheduledTasksByUser(authToken, filter.userID);
	};
};
