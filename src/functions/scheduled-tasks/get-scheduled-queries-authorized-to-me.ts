/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ScheduledQuery, ScheduledTask } from '../../models';
import { APIFunctionMakerOptions } from '../utils';
import { makeGetScheduledTasksAuthorizedToMe } from './get-scheduled-tasks-authorized-to-me';

const isScheduledQuery = (s: ScheduledTask): s is ScheduledQuery => s.type === 'query';

export const makeGetScheduledQueriesAuthorizedToMe = (makerOptions: APIFunctionMakerOptions) => {
	const getScheduledTasksAuthorizedToMe = makeGetScheduledTasksAuthorizedToMe(makerOptions);

	return async (authToken: string | null): Promise<Array<ScheduledQuery>> => {
		const scheduledTasks = await getScheduledTasksAuthorizedToMe(authToken);
		return scheduledTasks.filter(isScheduledQuery);
	};
};
