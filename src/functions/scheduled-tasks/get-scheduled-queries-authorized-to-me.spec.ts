/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { random, sortBy } from 'lodash';
import { isScheduledQuery, ScheduledQuery, User } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeLoginOneUser } from '../auth/login-one-user';
import { CreatableUser, makeCreateOneUser, makeGetOneUser } from '../users';
import { makeCreateManyScheduledQueries } from './create-many-scheduled-queries';
import { makeDeleteAllScheduledQueries } from './delete-all-scheduled-queries';
import { makeGetAllScheduledQueries } from './get-all-scheduled-queries';
import { makeGetScheduledQueriesAuthorizedToMe } from './get-scheduled-queries-authorized-to-me';

describe('getScheduledQueriesAuthorizedToMe()', () => {
	const getScheduledQueriesAuthorizedToMe = makeGetScheduledQueriesAuthorizedToMe({
		host: TEST_HOST,
		useEncryption: false,
	});
	const getAllScheduledQueries = makeGetAllScheduledQueries({ host: TEST_HOST, useEncryption: false });
	const getOneUser = makeGetOneUser({ host: TEST_HOST, useEncryption: false });
	const createOneUser = makeCreateOneUser({ host: TEST_HOST, useEncryption: false });
	const login = makeLoginOneUser({ host: TEST_HOST, useEncryption: false });
	const deleteAllScheduledQueries = makeDeleteAllScheduledQueries({ host: TEST_HOST, useEncryption: false });
	const createManyScheduledQueries = makeCreateManyScheduledQueries({ host: TEST_HOST, useEncryption: false });

	let adminScheduledQueries: Array<ScheduledQuery>;

	let analyst: User;
	let analystAuth: string;
	let analystScheduledQueries: Array<ScheduledQuery>;

	beforeEach(async () => {
		await deleteAllScheduledQueries(TEST_AUTH_TOKEN);

		// Create two scheduled queries as admin
		adminScheduledQueries = await createManyScheduledQueries(TEST_AUTH_TOKEN, [
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

		// Creates an analyst
		const userSeed = random(0, Number.MAX_SAFE_INTEGER).toString();
		const data: CreatableUser = {
			name: 'Test',
			email: userSeed + '@example.com',
			password: 'changeme',
			role: 'analyst',
			user: userSeed,
		};
		const userID = await createOneUser(TEST_AUTH_TOKEN, data);
		analyst = await getOneUser(TEST_AUTH_TOKEN, userID);
		analystAuth = await login(analyst.username, data.password);

		// Create three scheduled queries as analyst
		analystScheduledQueries = await createManyScheduledQueries(analystAuth, [
			{
				name: 'Q3',
				description: 'D3',
				schedule: '0 1 * * *',
				query: 'tag=netflow',
				searchSince: { secondsAgo: 60 * 60 },
			},
			{
				name: 'Q4',
				description: 'D4',
				schedule: '0 1 * * *',
				query: 'tag=default',
				searchSince: { lastRun: true, secondsAgo: 90 },
			},
			{
				name: 'Q5',
				description: 'D5',
				schedule: '0 1 * * *',
				query: 'tag=test',
				searchSince: { lastRun: true },
			},
		]);
	});

	it(
		'Returns all my scheduled queries',
		integrationTest(async () => {
			const actualAdminScheduledQueries = await getScheduledQueriesAuthorizedToMe(TEST_AUTH_TOKEN);
			expect(sortBy(actualAdminScheduledQueries, s => s.id)).toEqual(sortBy(adminScheduledQueries, s => s.id));
			for (const scheduledQuery of actualAdminScheduledQueries) expect(isScheduledQuery(scheduledQuery)).toBeTrue();

			const actualAnalystScheduledQueries = await getScheduledQueriesAuthorizedToMe(analystAuth);
			expect(sortBy(actualAnalystScheduledQueries, s => s.id)).toEqual(sortBy(analystScheduledQueries, s => s.id));
			for (const scheduledQuery of actualAnalystScheduledQueries) expect(isScheduledQuery(scheduledQuery)).toBeTrue();

			const allScheduledQueries = await getAllScheduledQueries(TEST_AUTH_TOKEN);
			expect(sortBy(allScheduledQueries, s => s.id)).toEqual(
				sortBy([...analystScheduledQueries, ...adminScheduledQueries], s => s.id),
			);
			for (const scheduledQuery of allScheduledQueries) expect(isScheduledQuery(scheduledQuery)).toBeTrue();
		}),
	);
});
