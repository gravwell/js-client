/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNil } from 'lodash';
import { APIFunctionMakerOptions } from '../utils';
import { makeDeleteOneScheduledQuery } from './delete-one-scheduled-query';
import { makeGetAllScheduledQueries } from './get-all-scheduled-queries';
import { ScheduledTasksFilter } from './get-many-scheduled-tasks';

export const makeDeleteManyScheduledQueries = (makerOptions: APIFunctionMakerOptions) => {
	const deleteOneScheduledQuery = makeDeleteOneScheduledQuery(makerOptions);
	const getAllScheduledQueries = makeGetAllScheduledQueries(makerOptions);

	return async (authToken: string | null, filter: ScheduledTasksFilter = {}): Promise<void> => {
		const queries = await getAllScheduledQueries(authToken);
		const filtered = queries.filter(q => {
			if (isNil(filter.userID)) return true;
			return q.userID === filter.userID;
		});

		const deletePs = filtered.map(q => deleteOneScheduledQuery(authToken, q.id));
		await Promise.all(deletePs);
	};
};
