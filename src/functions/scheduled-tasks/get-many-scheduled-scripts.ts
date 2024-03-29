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
import { NumericID } from '~/value-objects/id';
import { APIContext } from '../utils/api-context';
import { makeGetManyScheduledTasks } from './get-many-scheduled-tasks';

const isScheduledScript = (s: ScheduledTask): s is ScheduledScript => s.type === 'script';

export const makeGetManyScheduledScripts = (
	context: APIContext,
): ((filter?: ScheduledScriptsFilter) => Promise<Array<ScheduledScript>>) => {
	const getManyScheduledTasks = makeGetManyScheduledTasks(context);

	return async (filter: ScheduledScriptsFilter = {}): Promise<Array<ScheduledScript>> => {
		const tasks = await getManyScheduledTasks(filter);
		return tasks.filter(isScheduledScript);
	};
};

export interface ScheduledScriptsFilter {
	userID?: NumericID;
}
