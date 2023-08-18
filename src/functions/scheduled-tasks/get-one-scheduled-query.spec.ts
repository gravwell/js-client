/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { ScheduledQuery, scheduledQueryDecoder } from '~/models';
import { integrationTest, integrationTestSpecDef, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneScheduledQuery } from './create-one-scheduled-query';
import { makeDeleteAllScheduledQueries } from './delete-all-scheduled-queries';
import { makeGetOneScheduledQuery } from './get-one-scheduled-query';

describe(
	'getOneScheduledQuery()',
	integrationTestSpecDef(() => {
		let getOneScheduledQuery: ReturnType<typeof makeGetOneScheduledQuery>;
		beforeAll(async () => {
			getOneScheduledQuery = makeGetOneScheduledQuery(await TEST_BASE_API_CONTEXT());
		});
		let createOneScheduledQuery: ReturnType<typeof makeCreateOneScheduledQuery>;
		beforeAll(async () => {
			createOneScheduledQuery = makeCreateOneScheduledQuery(await TEST_BASE_API_CONTEXT());
		});
		let deleteAllScheduledQueries: ReturnType<typeof makeDeleteAllScheduledQueries>;
		beforeAll(async () => {
			deleteAllScheduledQueries = makeDeleteAllScheduledQueries(await TEST_BASE_API_CONTEXT());
		});

		let createdScheduledQuery: ScheduledQuery;

		beforeEach(async () => {
			await deleteAllScheduledQueries();

			// Create a scheduled query
			createdScheduledQuery = await createOneScheduledQuery({
				name: 'Q1',
				description: 'D1',
				schedule: '0 1 * * *',
				query: 'tag=netflow',
				searchSince: { secondsAgo: 60 * 60 },
			});
		});

		it(
			'Returns a scheduled query',
			integrationTest(async () => {
				const scheduledQuery = await getOneScheduledQuery(createdScheduledQuery.id);
				expect(scheduledQueryDecoder.guard(scheduledQuery)).toBeTrue();
				expect(scheduledQuery).toEqual(createdScheduledQuery);
			}),
		);

		it(
			"Returns an error if the scheduled query doesn't exist",
			integrationTest(async () => {
				await expectAsync(getOneScheduledQuery('non-existent')).toBeRejected();
			}),
		);
	}),
);
