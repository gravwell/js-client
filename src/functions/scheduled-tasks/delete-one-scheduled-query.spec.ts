/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeCreateManyScheduledQueries } from './create-many-scheduled-queries';
import { makeDeleteAllScheduledQueries } from './delete-all-scheduled-queries';
import { makeDeleteOneScheduledQuery } from './delete-one-scheduled-query';
import { makeGetAllScheduledQueries } from './get-all-scheduled-queries';
import { makeGetOneScheduledQuery } from './get-one-scheduled-query';

describe('deleteOneScheduledQuery()', () => {
	const deleteOneScheduledQuery = makeDeleteOneScheduledQuery({ host: TEST_HOST, useEncryption: false });
	const getAllScheduledQueries = makeGetAllScheduledQueries({ host: TEST_HOST, useEncryption: false });
	const getOneScheduledQuery = makeGetOneScheduledQuery({ host: TEST_HOST, useEncryption: false });
	const deleteAllScheduledQueries = makeDeleteAllScheduledQueries({ host: TEST_HOST, useEncryption: false });
	const createManyScheduledQueries = makeCreateManyScheduledQueries({ host: TEST_HOST, useEncryption: false });

	beforeEach(async () => {
		await deleteAllScheduledQueries(TEST_AUTH_TOKEN);

		// Create two scheduled queries
		await createManyScheduledQueries(TEST_AUTH_TOKEN, [
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
			const currentScheduledQueries = await getAllScheduledQueries(TEST_AUTH_TOKEN);
			const currentScheduledQueryIDs = currentScheduledQueries.map(m => m.id);
			expect(currentScheduledQueryIDs.length).toBe(2);

			const deleteScheduledQueryID = currentScheduledQueryIDs[0];
			await deleteOneScheduledQuery(TEST_AUTH_TOKEN, deleteScheduledQueryID);
			await expectAsync(getOneScheduledQuery(TEST_AUTH_TOKEN, deleteScheduledQueryID)).toBeRejected();

			const remainingScheduledQueries = await getAllScheduledQueries(TEST_AUTH_TOKEN);
			const remainingScheduledQueryIDs = remainingScheduledQueries.map(m => m.id);
			expect(remainingScheduledQueryIDs).not.toContain(deleteScheduledQueryID);
			expect(remainingScheduledQueryIDs.length).toBe(1);
		}),
	);
});
