/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { random } from 'lodash';
import { scheduledQueryDecoder } from '~/models/scheduled-task/is-scheduled-query';
import { CreatableUser } from '~/models/user/creatable-user';
import { User } from '~/models/user/user';
import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { integrationTest, integrationTestSpecDef } from '~/tests/test-types';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeCreateOneUser } from '../users/create-one-user';
import { makeCreateManyScheduledQueries } from './create-many-scheduled-queries';
import { makeDeleteAllScheduledQueries } from './delete-all-scheduled-queries';
import { makeGetAllScheduledQueries } from './get-all-scheduled-queries';
import { makeGetManyScheduledQueries } from './get-many-scheduled-queries';

describe(
	'getManyScheduledQueries()',
	integrationTestSpecDef(() => {
		let createOneUser: ReturnType<typeof makeCreateOneUser>;
		beforeAll(async () => {
			createOneUser = makeCreateOneUser(await TEST_BASE_API_CONTEXT());
		});
		let login: ReturnType<typeof makeLoginOneUser>;
		beforeAll(async () => {
			login = makeLoginOneUser(await TEST_BASE_API_CONTEXT());
		});
		let getAllScheduledQueries: ReturnType<typeof makeGetAllScheduledQueries>;
		beforeAll(async () => {
			getAllScheduledQueries = makeGetAllScheduledQueries(await TEST_BASE_API_CONTEXT());
		});
		let deleteAllScheduledQueries: ReturnType<typeof makeDeleteAllScheduledQueries>;
		beforeAll(async () => {
			deleteAllScheduledQueries = makeDeleteAllScheduledQueries(await TEST_BASE_API_CONTEXT());
		});
		let createManyScheduledQueries: ReturnType<typeof makeCreateManyScheduledQueries>;
		beforeAll(async () => {
			createManyScheduledQueries = makeCreateManyScheduledQueries(await TEST_BASE_API_CONTEXT());
		});
		let getManyScheduledQueries: ReturnType<typeof makeGetManyScheduledQueries>;
		beforeAll(async () => {
			getManyScheduledQueries = makeGetManyScheduledQueries(await TEST_BASE_API_CONTEXT());
		});

		let user: User;
		let userAuth: string;

		beforeEach(async () => {
			await deleteAllScheduledQueries();

			// Create two scheduled queries as admin
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

			// Creates an analyst
			const userSeed = random(0, Number.MAX_SAFE_INTEGER).toString();
			const data: CreatableUser = {
				name: 'Test',
				email: userSeed + '@example.com',
				password: 'changeme',
				role: 'analyst',
				username: userSeed,
			};
			user = await createOneUser(data);
			userAuth = await login(user.username, data.password);

			// Create three scheduled queries as analyst
			const createManyScheduledQueriesAsAnalyst = makeCreateManyScheduledQueries({
				...(await TEST_BASE_API_CONTEXT()),
				authToken: userAuth,
			});

			await createManyScheduledQueriesAsAnalyst([
				{
					name: 'Q3',
					description: 'D3',
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
					name: 'Q4',
					description: 'D4',
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
				{
					name: 'Q5',
					description: 'D5',
					schedule: '0 1 * * *',
					query: 'tag=test',
					searchSince: { lastRun: true, secondsAgo: 60 },
					timeframeOffset: { days: 0, hours: 0, minutes: 0, seconds: 0 },
					backfillEnabled: true,
					WriteAccess: {
						Global: false,
						GIDs: [],
					},
				},
			]);
		});

		xit(
			'Should return all scheduled queries of a user',
			integrationTest(async () => {
				const allScheduledQueries = await getAllScheduledQueries();
				const allScheduledQueryIDs = allScheduledQueries.map(s => s.id);
				const expectedAnalystScheduledQueryIDs = allScheduledQueries.filter(s => s.userID === user.id).map(s => s.id);
				expect(allScheduledQueryIDs.length).toBe(5);
				expect(expectedAnalystScheduledQueryIDs.length).toBe(3);

				const actualAnalystScheduledQueries = await getManyScheduledQueries({ userID: user.id });
				expect(actualAnalystScheduledQueries.length).toBe(expectedAnalystScheduledQueryIDs.length);
				expect(actualAnalystScheduledQueries.every(query => scheduledQueryDecoder.guard(query))).toBeTrue();
				expect(actualAnalystScheduledQueries.map(s => s.id).sort()).toEqual(expectedAnalystScheduledQueryIDs.sort());
			}),
		);
	}),
);
