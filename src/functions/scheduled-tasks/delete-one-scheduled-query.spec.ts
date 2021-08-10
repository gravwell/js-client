/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateManyScheduledQueries } from './create-many-scheduled-queries';
import { makeDeleteAllScheduledQueries } from './delete-all-scheduled-queries';
import { makeDeleteOneScheduledQuery } from './delete-one-scheduled-query';
import { makeGetAllScheduledQueries } from './get-all-scheduled-queries';
import { makeGetOneScheduledQuery } from './get-one-scheduled-query';

describe('deleteOneScheduledQuery()', () => {
	const deleteOneScheduledQuery = makeDeleteOneScheduledQuery(TEST_BASE_API_CONTEXT);
	const getAllScheduledQueries = makeGetAllScheduledQueries(TEST_BASE_API_CONTEXT);
	const getOneScheduledQuery = makeGetOneScheduledQuery(TEST_BASE_API_CONTEXT);
	const deleteAllScheduledQueries = makeDeleteAllScheduledQueries(TEST_BASE_API_CONTEXT);
	const createManyScheduledQueries = makeCreateManyScheduledQueries(TEST_BASE_API_CONTEXT);

	beforeEach(async () => {
		await deleteAllScheduledQueries();

		// Create two scheduled queries
		await createManyScheduledQueries([
			{
				name: 'Q1',
				description: 'D1',
				schedule: '0 1 * * *',
				query: 'tag=netflow',
				searchSince: { secondsAgo: 60 * 60 },
			},
			{
				name: 'Q2',
				description: 'D2',
				schedule: '0 1 * * *',
				query: 'tag=default',
				searchSince: { lastRun: true, secondsAgo: 90 },
			},
		]);
	});

	it(
		'Should delete a scheduled query',
		integrationTest(async () => {
			const currentScheduledQueries = await getAllScheduledQueries();
			const currentScheduledQueryIDs = currentScheduledQueries.map(m => m.id);
			expect(currentScheduledQueryIDs.length).toBe(2);

			const deleteScheduledQueryID = currentScheduledQueryIDs[0];
			await deleteOneScheduledQuery(deleteScheduledQueryID);
			await expectAsync(getOneScheduledQuery(deleteScheduledQueryID)).toBeRejected();

			const remainingScheduledQueries = await getAllScheduledQueries();
			const remainingScheduledQueryIDs = remainingScheduledQueries.map(m => m.id);
			expect(remainingScheduledQueryIDs).not.toContain(deleteScheduledQueryID);
			expect(remainingScheduledQueryIDs.length).toBe(1);
		}),
	);
});
