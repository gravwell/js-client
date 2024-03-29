/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { ScheduledQuery } from '~/models/scheduled-task/scheduled-query';
import { ScheduledTask } from '~/models/scheduled-task/scheduled-task';
import { NumericID } from '~/value-objects/id';
import { APIContext } from '../utils/api-context';
import { makeGetManyScheduledTasks } from './get-many-scheduled-tasks';

const isScheduledQuery = (s: ScheduledTask): s is ScheduledQuery => s.type === 'query';

export const makeGetManyScheduledQueries = (
	context: APIContext,
): ((filter?: ScheduledQueriesFilter) => Promise<Array<ScheduledQuery>>) => {
	const getManyScheduledTasks = makeGetManyScheduledTasks(context);

	return async (filter: ScheduledQueriesFilter = {}): Promise<Array<ScheduledQuery>> => {
		const tasks = await getManyScheduledTasks(filter);
		return tasks.filter(isScheduledQuery);
	};
};

export interface ScheduledQueriesFilter {
	userID?: NumericID;
}
