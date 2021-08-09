/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isScheduledTaskBase } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateManyScheduledQueries } from './create-many-scheduled-queries';
import { makeDeleteAllScheduledQueries } from './delete-all-scheduled-queries';
import { makeGetAllScheduledQueries } from './get-all-scheduled-queries';

describe('getAllScheduledQueries()', () => {
	const getAllScheduledQueries = makeGetAllScheduledQueries(TEST_BASE_API_CONTEXT);
	const deleteAllScheduledQueries = makeDeleteAllScheduledQueries(TEST_BASE_API_CONTEXT);
	const createManyScheduledQueries = makeCreateManyScheduledQueries(TEST_BASE_API_CONTEXT);

	beforeEach(async () => {
		await deleteAllScheduledQueries();
	});

	it(
		'Should return all scheduled queries',
		integrationTest(async () => {
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
					schedule: '0 0 * * *',

					query: 'tag=custom-test',
					searchSince: { lastRun: true },
				},
			]);

			const scheduledQueries = await getAllScheduledQueries();
			expect(scheduledQueries.length).toBe(2);
			expect(scheduledQueries.every(isScheduledTaskBase)).toBeTrue();
		}),
	);

	it(
		'Should return an empty array if there are no scheduled queries',
		integrationTest(async () => {
			const scheduledQueries = await getAllScheduledQueries();
			expect(scheduledQueries.length).toBe(0);
		}),
	);
});
