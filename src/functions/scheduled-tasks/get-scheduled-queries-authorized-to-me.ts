/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { ScheduledQuery, ScheduledTask } from '~/models';
import { APIContext } from '../utils';
import { makeGetScheduledTasksAuthorizedToMe } from './get-scheduled-tasks-authorized-to-me';

const isScheduledQuery = (s: ScheduledTask): s is ScheduledQuery => s.type === 'query';

export const makeGetScheduledQueriesAuthorizedToMe = (context: APIContext): (() => Promise<Array<ScheduledQuery>>) => {
	const getScheduledTasksAuthorizedToMe = makeGetScheduledTasksAuthorizedToMe(context);

	return async (): Promise<Array<ScheduledQuery>> => {
		const scheduledTasks = await getScheduledTasksAuthorizedToMe();
		return scheduledTasks.filter(isScheduledQuery);
	};
};
