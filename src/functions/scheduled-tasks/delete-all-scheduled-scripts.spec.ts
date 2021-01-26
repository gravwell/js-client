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
import { TEST_BASE_API_CONTEXT } from '../../tests/config';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeCreateOneUser } from '../users';
import { makeCreateManyScheduledScripts } from './create-many-scheduled-scripts';
import { makeDeleteAllScheduledScripts } from './delete-all-scheduled-scripts';
import { makeGetAllScheduledScripts } from './get-all-scheduled-scripts';

describe('deleteAllScheduledScripts()', () => {
	const createOneUser = makeCreateOneUser(TEST_BASE_API_CONTEXT);
	const login = makeLoginOneUser(TEST_BASE_API_CONTEXT);

	const getAllScheduledScripts = makeGetAllScheduledScripts(TEST_BASE_API_CONTEXT);
	const deleteAllScheduledScripts = makeDeleteAllScheduledScripts(TEST_BASE_API_CONTEXT);
	const createManyScheduledScripts = makeCreateManyScheduledScripts(TEST_BASE_API_CONTEXT);

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
		user = await createOneUser(data);
		userAuth = await login(user.username, data.password);

		// Create three scheduled scripts as analyst
		const createManyScheduledScriptsAsAnalyst = makeCreateManyScheduledScripts({
			...TEST_BASE_API_CONTEXT,
			authToken: userAuth,
		});

		await createManyScheduledScriptsAsAnalyst([
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
