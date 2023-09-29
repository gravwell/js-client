/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { random, sortBy } from 'lodash';
import { CreatableUser, ScheduledQuery, scheduledQueryDecoder, User } from '~/models';
import { integrationTest, integrationTestSpecDef, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeCreateOneUser, makeDeleteOneUser, makeGetAllUsers, makeGetMyUser } from '../users';
import { makeCreateManyScheduledQueries } from './create-many-scheduled-queries';
import { makeDeleteAllScheduledQueries } from './delete-all-scheduled-queries';
import { makeGetAllScheduledQueries } from './get-all-scheduled-queries';
import { makeGetScheduledQueriesAuthorizedToMe } from './get-scheduled-queries-authorized-to-me';

describe(
	'getScheduledQueriesAuthorizedToMe()',
	integrationTestSpecDef(() => {
		let getScheduledQueriesAuthorizedToMe: ReturnType<typeof makeGetScheduledQueriesAuthorizedToMe>;
		beforeAll(async () => {
			getScheduledQueriesAuthorizedToMe = makeGetScheduledQueriesAuthorizedToMe(await TEST_BASE_API_CONTEXT());
		});
		let getAllScheduledQueries: ReturnType<typeof makeGetAllScheduledQueries>;
		beforeAll(async () => {
			getAllScheduledQueries = makeGetAllScheduledQueries(await TEST_BASE_API_CONTEXT());
		});
		let createOneUser: ReturnType<typeof makeCreateOneUser>;
		beforeAll(async () => {
			createOneUser = makeCreateOneUser(await TEST_BASE_API_CONTEXT());
		});
		let login: ReturnType<typeof makeLoginOneUser>;
		beforeAll(async () => {
			login = makeLoginOneUser(await TEST_BASE_API_CONTEXT());
		});
		let deleteAllScheduledQueries: ReturnType<typeof makeDeleteAllScheduledQueries>;
		beforeAll(async () => {
			deleteAllScheduledQueries = makeDeleteAllScheduledQueries(await TEST_BASE_API_CONTEXT());
		});
		let createManyScheduledQueries: ReturnType<typeof makeCreateManyScheduledQueries>;
		beforeAll(async () => {
			createManyScheduledQueries = makeCreateManyScheduledQueries(await TEST_BASE_API_CONTEXT());
		});
		let getAllUsers: ReturnType<typeof makeGetAllUsers>;
		beforeAll(async () => {
			getAllUsers = makeGetAllUsers(await TEST_BASE_API_CONTEXT());
		});
		let getMyUser: ReturnType<typeof makeGetMyUser>;
		beforeAll(async () => {
			getMyUser = makeGetMyUser(await TEST_BASE_API_CONTEXT());
		});
		let deleteOneUser: ReturnType<typeof makeDeleteOneUser>;
		beforeAll(async () => {
			deleteOneUser = makeDeleteOneUser(await TEST_BASE_API_CONTEXT());
		});

		let adminScheduledQueries: Array<ScheduledQuery>;

		let analyst: User;
		let analystAuth: string;
		let analystScheduledQueries: Array<ScheduledQuery>;

		beforeEach(async () => {
			await deleteAllScheduledQueries();

			// Delete all users, except the admin
			const currentUsers = await getAllUsers();
			const myUser = await getMyUser();
			const currentUserIDs = currentUsers.map(u => u.id).filter(userID => userID !== myUser.id);
			const deleteUserPromises = currentUserIDs.map(userID => deleteOneUser(userID));
			await Promise.all(deleteUserPromises);

			// Create two scheduled queries as admin
			adminScheduledQueries = await createManyScheduledQueries([
				{
					name: 'Q1',
					description: 'D1',
					schedule: '0 1 * * *',
					query: 'tag=netflow',
					searchSince: { secondsAgo: 60 * 60 },
					timeframeOffset: { days: 0, hours: 0, minutes: 0, seconds: 0 },
					backfillEnabled: true,
				},
				{
					name: 'Q2',
					description: 'D2',
					schedule: '0 1 * * *',
					query: 'tag=default',
					searchSince: { lastRun: true, secondsAgo: 90 },
					timeframeOffset: { days: 0, hours: 0, minutes: 0, seconds: 0 },
					backfillEnabled: true,
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
			analyst = await createOneUser(data);
			analystAuth = await login(analyst.username, data.password);

			// Create three scheduled queries as analyst
			const createManyScheduledQueriesAsAnalyst = makeCreateManyScheduledQueries({
				...(await TEST_BASE_API_CONTEXT()),
				authToken: analystAuth,
			});

			analystScheduledQueries = await createManyScheduledQueriesAsAnalyst([
				{
					name: 'Q3',
					description: 'D3',
					schedule: '0 1 * * *',
					query: 'tag=netflow',
					searchSince: { secondsAgo: 60 * 60 },
					timeframeOffset: { days: 0, hours: 0, minutes: 0, seconds: 0 },
					backfillEnabled: true,
				},
				{
					name: 'Q4',
					description: 'D4',
					schedule: '0 1 * * *',
					query: 'tag=default',
					searchSince: { lastRun: true, secondsAgo: 90 },
					timeframeOffset: { days: 0, hours: 0, minutes: 0, seconds: 0 },
					backfillEnabled: true,
				},
				{
					name: 'Q5',
					description: 'D5',
					schedule: '0 1 * * *',
					query: 'tag=test',
					searchSince: { lastRun: true, secondsAgo: 90 },
					timeframeOffset: { days: 0, hours: 0, minutes: 0, seconds: 0 },
					backfillEnabled: true,
				},
			]);
		});

		it(
			'Returns all my scheduled queries',
			integrationTest(async () => {
				const actualAdminScheduledQueries = await getScheduledQueriesAuthorizedToMe();
				expect(sortBy(actualAdminScheduledQueries, s => s.id)).toEqual(sortBy(adminScheduledQueries, s => s.id));
				for (const scheduledQuery of actualAdminScheduledQueries) {
					expect(scheduledQueryDecoder.guard(scheduledQuery)).toBeTrue();
				}

				const getScheduledQueriesAuthorizedToAnalyst = makeGetScheduledQueriesAuthorizedToMe({
					...(await TEST_BASE_API_CONTEXT()),
					authToken: analystAuth,
				});

				const actualAnalystScheduledQueries = await getScheduledQueriesAuthorizedToAnalyst();
				expect(sortBy(actualAnalystScheduledQueries, s => s.id)).toEqual(sortBy(analystScheduledQueries, s => s.id));
				for (const scheduledQuery of actualAnalystScheduledQueries) {
					expect(scheduledQueryDecoder.guard(scheduledQuery)).toBeTrue();
				}

				const allScheduledQueries = await getAllScheduledQueries();
				expect(sortBy(allScheduledQueries, s => s.id)).toEqual(
					sortBy([...analystScheduledQueries, ...adminScheduledQueries], s => s.id),
				);
				for (const scheduledQuery of allScheduledQueries) {
					expect(scheduledQueryDecoder.guard(scheduledQuery)).toBeTrue();
				}
			}),
		);
	}),
);
