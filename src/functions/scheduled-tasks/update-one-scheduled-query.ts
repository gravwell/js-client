/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { ScheduledQuery } from '~/models/scheduled-task/scheduled-query';
import { UpdatableScheduledQuery } from '~/models/scheduled-task/updatable-scheduled-task';
import { APIContext } from '../utils/api-context';
import { makeUpdateOneScheduledTask } from './update-one-scheduled-task';

export const makeUpdateOneScheduledQuery = (
	context: APIContext,
): ((data: UpdatableScheduledQuery) => Promise<ScheduledQuery>) => {
	const updateOneScheduleTask = makeUpdateOneScheduledTask(context);

	return (data: UpdatableScheduledQuery): Promise<ScheduledQuery> => updateOneScheduleTask({ ...data, type: 'query' });
};
