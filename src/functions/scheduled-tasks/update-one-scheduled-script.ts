/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { ScheduledScript } from '~/models/scheduled-task/scheduled-script';
import { UpdatableScheduledScript } from '~/models/scheduled-task/updatable-scheduled-task';
import { APIContext } from '../utils/api-context';
import { makeUpdateOneScheduledTask } from './update-one-scheduled-task';

export const makeUpdateOneScheduledScript = (
	context: APIContext,
): ((data: UpdatableScheduledScript) => Promise<ScheduledScript>) => {
	const updateOneScheduleTask = makeUpdateOneScheduledTask(context);

	return (data: UpdatableScheduledScript): Promise<ScheduledScript> =>
		updateOneScheduleTask({ ...data, type: 'script' });
};
