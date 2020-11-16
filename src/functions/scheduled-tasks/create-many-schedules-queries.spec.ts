/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isScheduledQuery } from '../../models';
import { integrationTest, myCustomMatchers } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { NumericID } from '../../value-objects';
import { makeCreateOneGroup } from '../groups/create-one-group';
import { makeCreateManyScheduledQueries } from './create-many-scheduled-queries';
import { CreatableScheduledQuery } from './create-one-scheduled-task';
import { makeDeleteAllScheduledQueries } from './delete-all-scheduled-queries';

describe('createManyScheduledQueries()', () => {
	const createManyScheduledQueries = makeCreateManyScheduledQueries({ host: TEST_HOST, useEncryption: false });
	const createOneGroup = makeCreateOneGroup({ host: TEST_HOST, useEncryption: false });
	const deleteAllScheduledQueries = makeDeleteAllScheduledQueries({ host: TEST_HOST, useEncryption: false });

	let groupIDs: Array<NumericID>;

	beforeEach(async () => {
		jasmine.addMatchers(myCustomMatchers);

		await deleteAllScheduledQueries(TEST_AUTH_TOKEN);

		groupIDs = await Promise.all(
			Array.from({ length: 3 })
				.map((_, i) => `G${i}`)
				.map(name => createOneGroup(TEST_AUTH_TOKEN, { name })),
		);
	});

	it(
		'Should create a scheduled query and return it',
		integrationTest(async () => {
			const data: Array<CreatableScheduledQuery> = [
				{
					groupIDs,

					name: 'Q1',
					description: 'D1',

					schedule: '0 1 * * *',
					timezone: 'America/Sao_Paulo',

					query: 'tag=netflow',
					searchSince: { secondsAgo: 60 * 60 },

					oneShot: true,
					isDisabled: true,
				},
				{
					groupIDs,

					name: 'Q2',
					description: 'D2',

					schedule: '0 1 * * *',
					timezone: null,

					query: 'tag=default',
					searchSince: { lastRun: true, secondsAgo: 90 },

					oneShot: false,
					isDisabled: false,
				},
			];

			const scheduledQueries = await createManyScheduledQueries(TEST_AUTH_TOKEN, data);
			for (const q of scheduledQueries) expect(isScheduledQuery(q)).toBeTrue();
			expect(scheduledQueries).toPartiallyEqual(data);
		}),
	);
});
