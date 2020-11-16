/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { random } from 'lodash';
import { isScheduledQuery, User } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeLoginOneUser } from '../auth/login-one-user';
import { CreatableUser, makeCreateOneUser, makeGetOneUser } from '../users';
import { makeCreateManyScheduledQueries } from './create-many-scheduled-queries';
import { makeDeleteAllScheduledQueries } from './delete-all-scheduled-queries';
import { makeGetAllScheduledQueries } from './get-all-scheduled-queries';
import { makeGetManyScheduledQueries } from './get-many-scheduled-queries';

describe('getManyScheduledQueries()', () => {
	const getOneUser = makeGetOneUser({ host: TEST_HOST, useEncryption: false });
	const createOneUser = makeCreateOneUser({ host: TEST_HOST, useEncryption: false });
	const login = makeLoginOneUser({ host: TEST_HOST, useEncryption: false });
	const getAllScheduledQueries = makeGetAllScheduledQueries({ host: TEST_HOST, useEncryption: false });
	const deleteAllScheduledQueries = makeDeleteAllScheduledQueries({ host: TEST_HOST, useEncryption: false });
	const createManyScheduledQueries = makeCreateManyScheduledQueries({ host: TEST_HOST, useEncryption: false });
	const getManyScheduledQueries = makeGetManyScheduledQueries({ host: TEST_HOST, useEncryption: false });

	let user: User;
	let userAuth: string;

	beforeEach(async () => {
		await deleteAllScheduledQueries(TEST_AUTH_TOKEN);

		// Create two scheduled queries as admin
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
		user = await getOneUser(TEST_AUTH_TOKEN, userID);
		userAuth = await login(user.username, data.password);

		// Create three scheduled queries as analyst
		await createManyScheduledQueries(userAuth, [
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
		'Should return all scheduled queries of a user',
		integrationTest(async () => {
			const allScheduledQueries = await getAllScheduledQueries(TEST_AUTH_TOKEN);
			const allScheduledQueryIDs = allScheduledQueries.map(s => s.id);
			const expectedAnalystScheduledQueryIDs = allScheduledQueries.filter(s => s.userID === user.id).map(s => s.id);
			expect(allScheduledQueryIDs.length).toBe(5);
			expect(expectedAnalystScheduledQueryIDs.length).toBe(3);

			const actualAnalystScheduledQueries = await getManyScheduledQueries(TEST_AUTH_TOKEN, { userID: user.id });
			expect(actualAnalystScheduledQueries.length).toBe(expectedAnalystScheduledQueryIDs.length);
			expect(actualAnalystScheduledQueries.every(isScheduledQuery)).toBeTrue();
			expect(actualAnalystScheduledQueries.map(s => s.id).sort()).toEqual(expectedAnalystScheduledQueryIDs.sort());
		}),
	);
});
