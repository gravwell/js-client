/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ScheduledQuery, ScheduledTask } from '~/models';
import { APIContext } from '../utils';
import { makeGetAllScheduledTasks } from './get-all-scheduled-tasks';

const isScheduledQuery = (s: ScheduledTask): s is ScheduledQuery => s.type === 'query';

export const makeGetAllScheduledQueries = (context: APIContext) => {
	const getAllScheduledTasks = makeGetAllScheduledTasks(context);

	return async (): Promise<Array<ScheduledQuery>> => {
		const scheduledTasks = await getAllScheduledTasks();
		return scheduledTasks.filter(isScheduledQuery);
	};
};
