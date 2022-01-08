/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { random } from 'lodash';
import { CreatableUser, isScheduledScript, User } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeCreateOneUser } from '../users';
import { makeCreateManyScheduledScripts } from './create-many-scheduled-scripts';
import { makeDeleteAllScheduledScripts } from './delete-all-scheduled-scripts';
import { makeGetAllScheduledScripts } from './get-all-scheduled-scripts';
import { makeGetManyScheduledScripts } from './get-many-scheduled-scripts';

describe('getManyScheduledScripts()', () => {
	const createOneUser = makeCreateOneUser(TEST_BASE_API_CONTEXT);
	const login = makeLoginOneUser(TEST_BASE_API_CONTEXT);
	const getAllScheduledScripts = makeGetAllScheduledScripts(TEST_BASE_API_CONTEXT);
	const deleteAllScheduledScripts = makeDeleteAllScheduledScripts(TEST_BASE_API_CONTEXT);
	const createManyScheduledScripts = makeCreateManyScheduledScripts(TEST_BASE_API_CONTEXT);
	const getManyScheduledScripts = makeGetManyScheduledScripts(TEST_BASE_API_CONTEXT);

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

	xit(
		'Should return all scheduled scripts of a user',
		integrationTest(async () => {
			const allScheduledScripts = await getAllScheduledScripts();
			const allScheduledScriptIDs = allScheduledScripts.map(s => s.id);
			const expectedAnalystScheduledScriptIDs = allScheduledScripts.filter(s => s.userID === user.id).map(s => s.id);
			expect(allScheduledScriptIDs.length).toBe(5);
			expect(expectedAnalystScheduledScriptIDs.length).toBe(3);

			const actualAnalystScheduledScripts = await getManyScheduledScripts({ userID: user.id });
			expect(actualAnalystScheduledScripts.length).toBe(expectedAnalystScheduledScriptIDs.length);
			expect(actualAnalystScheduledScripts.every(isScheduledScript)).toBeTrue();
			expect(actualAnalystScheduledScripts.map(s => s.id).sort()).toEqual(expectedAnalystScheduledScriptIDs.sort());
		}),
	);
});
