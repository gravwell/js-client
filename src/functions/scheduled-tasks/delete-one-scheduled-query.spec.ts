/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { integrationTest, integrationTestSpecDef } from '~/tests/test-types';
import { sleep } from '~/tests/utils';
import { assertIsNotNil } from '../utils/type-guards';
import { makeCreateManyScheduledQueries } from './create-many-scheduled-queries';
import { makeDeleteAllScheduledQueries } from './delete-all-scheduled-queries';
import { makeDeleteOneScheduledQuery } from './delete-one-scheduled-query';
import { makeGetAllScheduledQueries } from './get-all-scheduled-queries';
import { makeGetOneScheduledQuery } from './get-one-scheduled-query';

describe(
	'deleteOneScheduledQuery()',
	integrationTestSpecDef(() => {
		let deleteOneScheduledQuery: ReturnType<typeof makeDeleteOneScheduledQuery>;
		beforeAll(async () => {
			deleteOneScheduledQuery = makeDeleteOneScheduledQuery(await TEST_BASE_API_CONTEXT());
		});
		let getAllScheduledQueries: ReturnType<typeof makeGetAllScheduledQueries>;
		beforeAll(async () => {
			getAllScheduledQueries = makeGetAllScheduledQueries(await TEST_BASE_API_CONTEXT());
		});
		let getOneScheduledQuery: ReturnType<typeof makeGetOneScheduledQuery>;
		beforeAll(async () => {
			getOneScheduledQuery = makeGetOneScheduledQuery(await TEST_BASE_API_CONTEXT());
		});
		let deleteAllScheduledQueries: ReturnType<typeof makeDeleteAllScheduledQueries>;
		beforeAll(async () => {
			deleteAllScheduledQueries = makeDeleteAllScheduledQueries(await TEST_BASE_API_CONTEXT());
		});
		let createManyScheduledQueries: ReturnType<typeof makeCreateManyScheduledQueries>;
		beforeAll(async () => {
			createManyScheduledQueries = makeCreateManyScheduledQueries(await TEST_BASE_API_CONTEXT());
		});

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
					timeframeOffset: { days: 0, hours: 0, minutes: 0, seconds: 0 },
					backfillEnabled: true,
					WriteAccess: {
						Global: false,
						GIDs: [],
					},
				},
				{
					name: 'Q2',
					description: 'D2',
					schedule: '0 1 * * *',
					query: 'tag=default',
					searchSince: { lastRun: true, secondsAgo: 90 },
					timeframeOffset: { days: 0, hours: 0, minutes: 0, seconds: 0 },
					backfillEnabled: true,
					WriteAccess: {
						Global: false,
						GIDs: [],
					},
				},
			]);

			// There appears to be a race with the backend to create the macros.
			await sleep(3000);
		});

		it(
			'Should delete a scheduled query',
			integrationTest(async () => {
				const currentScheduledQueries = await getAllScheduledQueries();
				const currentScheduledQueryIDs = currentScheduledQueries.map(m => m.id);
				expect(currentScheduledQueryIDs.length).toBe(2);

				const deleteScheduledQueryID = currentScheduledQueryIDs[0];
				assertIsNotNil(deleteScheduledQueryID);

				await deleteOneScheduledQuery(deleteScheduledQueryID);
				await expectAsync(getOneScheduledQuery(deleteScheduledQueryID)).toBeRejected();

				const remainingScheduledQueries = await getAllScheduledQueries();
				const remainingScheduledQueryIDs = remainingScheduledQueries.map(m => m.id);
				expect(remainingScheduledQueryIDs).not.toContain(deleteScheduledQueryID);
				expect(remainingScheduledQueryIDs.length).toBe(1);
			}),
		);
	}),
);
