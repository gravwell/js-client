/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { random } from 'lodash';
import { CreatableUser, isScheduledScript, User } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeCreateOneUser, makeGetOneUser } from '../users';
import { makeCreateManyScheduledScripts } from './create-many-scheduled-scripts';
import { makeDeleteAllScheduledScripts } from './delete-all-scheduled-scripts';
import { makeGetAllScheduledScripts } from './get-all-scheduled-scripts';
import { makeGetManyScheduledScripts } from './get-many-scheduled-scripts';

describe('getManyScheduledScripts()', () => {
	const getOneUser = makeGetOneUser({ host: TEST_HOST, useEncryption: false });
	const createOneUser = makeCreateOneUser({ host: TEST_HOST, useEncryption: false });
	const login = makeLoginOneUser({ host: TEST_HOST, useEncryption: false });
	const getAllScheduledScripts = makeGetAllScheduledScripts({ host: TEST_HOST, useEncryption: false });
	const deleteAllScheduledScripts = makeDeleteAllScheduledScripts({ host: TEST_HOST, useEncryption: false });
	const createManyScheduledScripts = makeCreateManyScheduledScripts({ host: TEST_HOST, useEncryption: false });
	const getManyScheduledScripts = makeGetManyScheduledScripts({ host: TEST_HOST, useEncryption: false });

	let user: User;
	let userAuth: string;

	beforeEach(async () => {
		await deleteAllScheduledScripts(TEST_AUTH_TOKEN);

		// Create two scheduled scripts as admin
		await createManyScheduledScripts(TEST_AUTH_TOKEN, [
			{
				name: 'Script1',
				description: 'D1',
				schedule: '0 1 * * *',
				script: '1 + 2',
			},
			{
				name: 'Script2',
				description: 'D2',
				schedule: '0 1 * * *',
				script: '1 + 2',
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

		// Create three scheduled scripts as analyst
		await createManyScheduledScripts(userAuth, [
			{
				name: 'Script3',
				description: 'D3',
				schedule: '0 1 * * *',
				script: '1 + 2',
			},
			{
				name: 'Script4',
				description: 'D4',
				schedule: '0 1 * * *',
				script: '1 + 2',
			},
			{
				name: 'Script5',
				description: 'D5',
				schedule: '0 1 * * *',
				script: '1 + 2',
			},
		]);
	});

	it(
		'Should return all scheduled scripts of a user',
		integrationTest(async () => {
			const allScheduledScripts = await getAllScheduledScripts(TEST_AUTH_TOKEN);
			const allScheduledScriptIDs = allScheduledScripts.map(s => s.id);
			const expectedAnalystScheduledScriptIDs = allScheduledScripts.filter(s => s.userID === user.id).map(s => s.id);
			expect(allScheduledScriptIDs.length).toBe(5);
			expect(expectedAnalystScheduledScriptIDs.length).toBe(3);

			const actualAnalystScheduledScripts = await getManyScheduledScripts(TEST_AUTH_TOKEN, { userID: user.id });
			expect(actualAnalystScheduledScripts.length).toBe(expectedAnalystScheduledScriptIDs.length);
			expect(actualAnalystScheduledScripts.every(isScheduledScript)).toBeTrue();
			expect(actualAnalystScheduledScripts.map(s => s.id).sort()).toEqual(expectedAnalystScheduledScriptIDs.sort());
		}),
	);
});
