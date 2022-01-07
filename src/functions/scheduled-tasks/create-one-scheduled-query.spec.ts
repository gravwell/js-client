/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableScheduledQuery, isScheduledQuery } from '~/models';
import { integrationTest, myCustomMatchers, TEST_BASE_API_CONTEXT } from '~/tests';
import { NumericID } from '~/value-objects';
import { makeCreateOneGroup } from '../groups/create-one-group';
import { makeDeleteAllGroups } from '../groups/delete-all-groups';
import { makeCreateOneScheduledQuery } from './create-one-scheduled-query';
import { makeDeleteAllScheduledQueries } from './delete-all-scheduled-queries';

describe('createOneScheduledQuery()', () => {
	const createOneScheduledQuery = makeCreateOneScheduledQuery(TEST_BASE_API_CONTEXT);
	const createOneGroup = makeCreateOneGroup(TEST_BASE_API_CONTEXT);
	const deleteAllScheduledQueries = makeDeleteAllScheduledQueries(TEST_BASE_API_CONTEXT);
	const deleteAllGroups = makeDeleteAllGroups(TEST_BASE_API_CONTEXT);

	let groupIDs: Array<NumericID>;

	beforeEach(async () => {
		jasmine.addMatchers(myCustomMatchers);

		await deleteAllScheduledQueries();
		// delete all groups to 	avoid dup check in backend
		await deleteAllGroups();

		groupIDs = (
			await Promise.all(
				Array.from({ length: 3 })
					.map((_, i) => `G${i}`)
					.map(name => createOneGroup({ name })),
			)
		).map(g => g.id);
	});

	it(
		'Should create a scheduled query and return it',
		integrationTest(async () => {
			const data: CreatableScheduledQuery = {
				groupIDs,

				name: 'Q1',
				description: 'D1',

				schedule: '0 1 * * *',
				timezone: 'America/Sao_Paulo',

				query: 'tag=netflow',
				searchSince: { secondsAgo: 60 * 60 },

				oneShot: true,
				isDisabled: true,
			};

			const scheduledQuery = await createOneScheduledQuery(data);
			expect(isScheduledQuery(scheduledQuery)).toBeTrue();
			expect(scheduledQuery).toPartiallyEqual(data);
		}),
	);
});
