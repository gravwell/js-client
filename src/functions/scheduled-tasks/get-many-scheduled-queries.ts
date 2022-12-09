/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { ScheduledQuery, ScheduledTask } from '~/models';
import { NumericID } from '~/value-objects';
import { APIContext } from '../utils';
import { makeGetManyScheduledTasks } from './get-many-scheduled-tasks';

const isScheduledQuery = (s: ScheduledTask): s is ScheduledQuery => s.type === 'query';

export const makeGetManyScheduledQueries = (context: APIContext) => {
	const getManyScheduledTasks = makeGetManyScheduledTasks(context);

	return async (filter: ScheduledQueriesFilter = {}): Promise<Array<ScheduledQuery>> => {
		const tasks = await getManyScheduledTasks(filter);
		return tasks.filter(isScheduledQuery);
	};
};

export interface ScheduledQueriesFilter {
	userID?: NumericID;
}
