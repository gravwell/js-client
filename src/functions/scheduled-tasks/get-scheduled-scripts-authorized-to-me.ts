/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { ScheduledScript } from '~/models/scheduled-task/scheduled-script';
import { ScheduledTask } from '~/models/scheduled-task/scheduled-task';
import { APIContext } from '../utils/api-context';
import { makeGetScheduledTasksAuthorizedToMe } from './get-scheduled-tasks-authorized-to-me';

const isScheduledScript = (s: ScheduledTask): s is ScheduledScript => s.type === 'script';

export const makeGetScheduledScriptsAuthorizedToMe = (context: APIContext): (() => Promise<Array<ScheduledScript>>) => {
	const getScheduledTasksAuthorizedToMe = makeGetScheduledTasksAuthorizedToMe(context);

	return async (): Promise<Array<ScheduledScript>> => {
		const scheduledTasks = await getScheduledTasksAuthorizedToMe();
		return scheduledTasks.filter(isScheduledScript);
	};
};
