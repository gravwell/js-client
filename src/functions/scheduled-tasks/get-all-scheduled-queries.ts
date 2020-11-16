/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ScheduledQuery, ScheduledTask } from '../../models';
import { APIFunctionMakerOptions } from '../utils';
import { makeGetAllScheduledTasks } from './get-all-scheduled-tasks';

const isScheduledQuery = (s: ScheduledTask): s is ScheduledQuery => s.type === 'query';

export const makeGetAllScheduledQueries = (makerOptions: APIFunctionMakerOptions) => {
	const getAllScheduledTasks = makeGetAllScheduledTasks(makerOptions);

	return async (authToken: string | null): Promise<Array<ScheduledQuery>> => {
		const scheduledTasks = await getAllScheduledTasks(authToken);
		return scheduledTasks.filter(isScheduledQuery);
	};
};
