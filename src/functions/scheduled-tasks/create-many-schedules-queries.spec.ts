/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableScheduledQuery } from '~/models/scheduled-task/creatable-scheduled-query';
import { scheduledQueryDecoder } from '~/models/scheduled-task/is-scheduled-query';
import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { myCustomMatchers } from '~/tests/custom-matchers';
import { integrationTest, integrationTestSpecDef } from '~/tests/test-types';
import { NumericID } from '~/value-objects/id';
import { makeCreateOneGroup } from '../groups/create-one-group';
import { makeDeleteAllGroups } from '../groups/delete-all-groups';
import { makeCreateManyScheduledQueries } from './create-many-scheduled-queries';
import { makeDeleteAllScheduledQueries } from './delete-all-scheduled-queries';

describe(
	'createManyScheduledQueries()',
	integrationTestSpecDef(() => {
		let createManyScheduledQueries: ReturnType<typeof makeCreateManyScheduledQueries>;
		beforeAll(async () => {
			createManyScheduledQueries = makeCreateManyScheduledQueries(await TEST_BASE_API_CONTEXT());
		});
		let createOneGroup: ReturnType<typeof makeCreateOneGroup>;
		beforeAll(async () => {
			createOneGroup = makeCreateOneGroup(await TEST_BASE_API_CONTEXT());
		});
		let deleteAllScheduledQueries: ReturnType<typeof makeDeleteAllScheduledQueries>;
		beforeAll(async () => {
			deleteAllScheduledQueries = makeDeleteAllScheduledQueries(await TEST_BASE_API_CONTEXT());
		});
		let deleteAllGroups: ReturnType<typeof makeDeleteAllGroups>;
		beforeAll(async () => {
			deleteAllGroups = makeDeleteAllGroups(await TEST_BASE_API_CONTEXT());
		});

		let groupIDs: Array<NumericID>;

		beforeEach(async () => {
			jasmine.addMatchers(myCustomMatchers);

			await deleteAllScheduledQueries();
			// avoid dup error from backend
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

						timeframeOffset: { days: 0, hours: 0, minutes: 0, seconds: 0 },
						WriteAccess: {
							Global: false,
							GIDs: [],
						},
						backfillEnabled: false,
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

						timeframeOffset: { days: 0, hours: 0, minutes: 0, seconds: 0 },
						WriteAccess: {
							Global: false,
							GIDs: [],
						},
						backfillEnabled: false,
					},
				];

				const scheduledQueries = await createManyScheduledQueries(data);
				for (const q of scheduledQueries) {
					expect(scheduledQueryDecoder.guard(q)).toBeTrue();
				}
				expect(scheduledQueries).toPartiallyEqual(data);
			}),
		);
	}),
);
