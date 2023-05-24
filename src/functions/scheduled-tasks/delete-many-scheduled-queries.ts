/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isNil } from 'lodash';
import { APIContext } from '../utils';
import { makeDeleteOneScheduledQuery } from './delete-one-scheduled-query';
import { makeGetAllScheduledQueries } from './get-all-scheduled-queries';
import { ScheduledTasksFilter } from './get-many-scheduled-tasks';

export const makeDeleteManyScheduledQueries = (
	context: APIContext,
): ((filter?: ScheduledTasksFilter) => Promise<void>) => {
	const deleteOneScheduledQuery = makeDeleteOneScheduledQuery(context);
	const getAllScheduledQueries = makeGetAllScheduledQueries(context);

	return async (filter: ScheduledTasksFilter = {}): Promise<void> => {
		const queries = await getAllScheduledQueries();
		const filtered = queries.filter(q => {
			if (isNil(filter.userID)) {
				return true;
			}
			return q.userID === filter.userID;
		});

		const deletePs = filtered.map(q => deleteOneScheduledQuery(q.id));
		await Promise.all(deletePs);
	};
};
