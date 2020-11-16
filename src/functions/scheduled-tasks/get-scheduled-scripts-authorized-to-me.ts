/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ScheduledScript, ScheduledTask } from '../../models';
import { APIFunctionMakerOptions } from '../utils';
import { makeGetScheduledTasksAuthorizedToMe } from './get-scheduled-tasks-authorized-to-me';

const isScheduledScript = (s: ScheduledTask): s is ScheduledScript => s.type === 'script';

export const makeGetScheduledScriptsAuthorizedToMe = (makerOptions: APIFunctionMakerOptions) => {
	const getScheduledTasksAuthorizedToMe = makeGetScheduledTasksAuthorizedToMe(makerOptions);

	return async (authToken: string | null): Promise<Array<ScheduledScript>> => {
		const scheduledTasks = await getScheduledTasksAuthorizedToMe(authToken);
		return scheduledTasks.filter(isScheduledScript);
	};
};
