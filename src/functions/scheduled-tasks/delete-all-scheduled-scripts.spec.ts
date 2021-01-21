/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { random } from 'lodash';
import { CreatableUser, User } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeCreateOneUser, makeGetOneUser } from '../users';
import { makeCreateManyScheduledScripts } from './create-many-scheduled-scripts';
import { makeDeleteAllScheduledScripts } from './delete-all-scheduled-scripts';
import { makeGetAllScheduledScripts } from './get-all-scheduled-scripts';

describe('deleteAllScheduledScripts()', () => {
	const getOneUser = makeGetOneUser({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const createOneUser = makeCreateOneUser({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const login = makeLoginOneUser({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });

	const getAllScheduledScripts = makeGetAllScheduledScripts({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const deleteAllScheduledScripts = makeDeleteAllScheduledScripts({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const createManyScheduledScripts = makeCreateManyScheduledScripts({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});

	let user: User;
	let userAuth: string;

	beforeEach(async () => {
		await deleteAllScheduledScripts();

		// Create two scheduled scripts as admin
		await createManyScheduledScripts([
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
		const userID = await createOneUser(data);
		user = await getOneUser(userID);
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
		'Should delete all scheduled scripts',
		integrationTest(async () => {
			const allScheduledScriptsBefore = await getAllScheduledScripts();
			const allScheduledScriptIDsBefore = allScheduledScriptsBefore.map(s => s.id);
			const analystScheduledScriptIDsBefore = allScheduledScriptsBefore
				.filter(s => s.userID === user.id)
				.map(s => s.id);
			expect(allScheduledScriptIDsBefore.length).toBe(5);
			expect(analystScheduledScriptIDsBefore.length).toBe(3);

			await deleteAllScheduledScripts();

			const allScheduledScriptsAfter = await getAllScheduledScripts();
			const allScheduledScriptIDsAfter = allScheduledScriptsAfter.map(s => s.id);
			const analystScheduledScriptIDsAfter = allScheduledScriptsAfter.filter(s => s.userID === user.id).map(s => s.id);
			expect(allScheduledScriptIDsAfter.length).toBe(0);
			expect(analystScheduledScriptIDsAfter.length).toBe(0);
		}),
	);
});
