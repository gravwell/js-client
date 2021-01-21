/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isScheduledQuery, ScheduledQuery } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeCreateOneScheduledQuery } from './create-one-scheduled-query';
import { makeDeleteAllScheduledQueries } from './delete-all-scheduled-queries';
import { makeGetOneScheduledQuery } from './get-one-scheduled-query';

describe('getOneScheduledQuery()', () => {
	const getOneScheduledQuery = makeGetOneScheduledQuery({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const createOneScheduledQuery = makeCreateOneScheduledQuery({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const deleteAllScheduledQueries = makeDeleteAllScheduledQueries({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
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
			expect(isScheduledQuery(scheduledQuery)).toBeTrue();
			expect(scheduledQuery).toEqual(createdScheduledQuery);
		}),
	);

	it(
		"Returns an error if the scheduled query doesn't exist",
		integrationTest(async () => {
			await expectAsync(getOneScheduledQuery('non-existent')).toBeRejected();
		}),
	);
});
