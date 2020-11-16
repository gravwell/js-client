/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { APIFunctionMakerOptions } from '../utils';
import { makeDeleteOneScheduledQuery } from './delete-one-scheduled-query';
import { makeGetAllScheduledQueries } from './get-all-scheduled-queries';

export const makeDeleteAllScheduledQueries = (makerOptions: APIFunctionMakerOptions) => {
	const deleteOneScheduledQuery = makeDeleteOneScheduledQuery(makerOptions);
	const getAllScheduledQueries = makeGetAllScheduledQueries(makerOptions);

	return async (authToken: string | null): Promise<void> => {
		const queries = await getAllScheduledQueries(authToken);
		const deletePs = queries.map(q => deleteOneScheduledQuery(authToken, q.id));
		await Promise.all(deletePs);
	};
};
