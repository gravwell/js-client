/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { APIContext } from '../utils';
import { makeDeleteOneScheduledQuery } from './delete-one-scheduled-query';
import { makeGetAllScheduledQueries } from './get-all-scheduled-queries';

export const makeDeleteAllScheduledQueries = (context: APIContext) => {
	const deleteOneScheduledQuery = makeDeleteOneScheduledQuery(context);
	const getAllScheduledQueries = makeGetAllScheduledQueries(context);

	return async (): Promise<void> => {
		const queries = await getAllScheduledQueries();
		const deletePs = queries.map(q => deleteOneScheduledQuery(q.id));
		await Promise.all(deletePs);
	};
};
