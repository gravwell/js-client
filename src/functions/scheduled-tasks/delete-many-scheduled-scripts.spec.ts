/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { random } from 'lodash';
import { CreatableUser } from '~/models/user/creatable-user';
import { User } from '~/models/user/user';
import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { integrationTest, integrationTestSpecDef } from '~/tests/test-types';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeCreateOneUser } from '../users/create-one-user';
import { makeCreateManyScheduledScripts } from './create-many-scheduled-scripts';
import { makeDeleteAllScheduledScripts } from './delete-all-scheduled-scripts';
import { makeDeleteManyScheduledScripts } from './delete-many-scheduled-scripts';
import { makeGetAllScheduledScripts } from './get-all-scheduled-scripts';

describe(
	'deleteManyScheduledScripts()',
	integrationTestSpecDef(() => {
		let createOneUser: ReturnType<typeof makeCreateOneUser>;
		beforeAll(async () => {
			createOneUser = makeCreateOneUser(await TEST_BASE_API_CONTEXT());
		});
		let login: ReturnType<typeof makeLoginOneUser>;
		beforeAll(async () => {
			login = makeLoginOneUser(await TEST_BASE_API_CONTEXT());
		});
		let getAllScheduledScripts: ReturnType<typeof makeGetAllScheduledScripts>;
		beforeAll(async () => {
			getAllScheduledScripts = makeGetAllScheduledScripts(await TEST_BASE_API_CONTEXT());
		});
		let deleteAllScheduledScripts: ReturnType<typeof makeDeleteAllScheduledScripts>;
		beforeAll(async () => {
			deleteAllScheduledScripts = makeDeleteAllScheduledScripts(await TEST_BASE_API_CONTEXT());
		});
		let createManyScheduledScripts: ReturnType<typeof makeCreateManyScheduledScripts>;
		beforeAll(async () => {
			createManyScheduledScripts = makeCreateManyScheduledScripts(await TEST_BASE_API_CONTEXT());
		});
		let deleteManyScheduledScripts: ReturnType<typeof makeDeleteManyScheduledScripts>;
		beforeAll(async () => {
			deleteManyScheduledScripts = makeDeleteManyScheduledScripts(await TEST_BASE_API_CONTEXT());
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
				username: userSeed,
			};
			user = await createOneUser(data);
			userAuth = await login(user.username, data.password);

			// Create three scheduled scripts as analyst
			const createManyScheduledScriptsAsAnalyst = makeCreateManyScheduledScripts({
				...(await TEST_BASE_API_CONTEXT()),
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
			'Should delete all scheduled scripts of a user',
			integrationTest(async () => {
				const allScheduledScriptsBefore = await getAllScheduledScripts();
				const allScheduledScriptIDsBefore = allScheduledScriptsBefore.map(s => s.id);
				const analystScheduledScriptIDsBefore = allScheduledScriptsBefore
					.filter(s => s.userID === user.id)
					.map(s => s.id);
				expect(allScheduledScriptIDsBefore.length).toBe(5);
				expect(analystScheduledScriptIDsBefore.length).toBe(3);

				await deleteManyScheduledScripts({ userID: user.id });

				const allScheduledScriptsAfter = await getAllScheduledScripts();
				const allScheduledScriptIDsAfter = allScheduledScriptsAfter.map(s => s.id);
				const analystScheduledScriptIDsAfter = allScheduledScriptsAfter
					.filter(s => s.userID === user.id)
					.map(s => s.id);
				expect(allScheduledScriptIDsAfter.length).toBe(2);
				expect(analystScheduledScriptIDsAfter.length).toBe(0);
			}),
		);
	}),
);
