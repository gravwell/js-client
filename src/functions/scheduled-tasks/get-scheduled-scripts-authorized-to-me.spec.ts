/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { random, sortBy } from 'lodash';
import { CreatableUser, isScheduledScript, ScheduledScript, User } from '~/models';
import { integrationTest, integrationTestSpecDef, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeCreateOneUser } from '../users';
import { makeCreateManyScheduledScripts } from './create-many-scheduled-scripts';
import { makeDeleteAllScheduledScripts } from './delete-all-scheduled-scripts';
import { makeGetAllScheduledScripts } from './get-all-scheduled-scripts';
import { makeGetScheduledScriptsAuthorizedToMe } from './get-scheduled-scripts-authorized-to-me';

describe(
	'getScheduledScriptsAuthorizedToMe()',
	integrationTestSpecDef(() => {
		let getScheduledScriptsAuthorizedToMe: ReturnType<typeof makeGetScheduledScriptsAuthorizedToMe>;
		beforeAll(async () => {
			getScheduledScriptsAuthorizedToMe = makeGetScheduledScriptsAuthorizedToMe(await TEST_BASE_API_CONTEXT());
		});
		let getAllScheduledScripts: ReturnType<typeof makeGetAllScheduledScripts>;
		beforeAll(async () => {
			getAllScheduledScripts = makeGetAllScheduledScripts(await TEST_BASE_API_CONTEXT());
		});
		let createOneUser: ReturnType<typeof makeCreateOneUser>;
		beforeAll(async () => {
			createOneUser = makeCreateOneUser(await TEST_BASE_API_CONTEXT());
		});
		let login: ReturnType<typeof makeLoginOneUser>;
		beforeAll(async () => {
			login = makeLoginOneUser(await TEST_BASE_API_CONTEXT());
		});
		let deleteAllScheduledScripts: ReturnType<typeof makeDeleteAllScheduledScripts>;
		beforeAll(async () => {
			deleteAllScheduledScripts = makeDeleteAllScheduledScripts(await TEST_BASE_API_CONTEXT());
		});
		let createManyScheduledScripts: ReturnType<typeof makeCreateManyScheduledScripts>;
		beforeAll(async () => {
			createManyScheduledScripts = makeCreateManyScheduledScripts(await TEST_BASE_API_CONTEXT());
		});

		let adminScheduledScripts: Array<ScheduledScript>;

		let analyst: User;
		let analystAuth: string;
		let analystScheduledScripts: Array<ScheduledScript>;

		beforeEach(async () => {
			await deleteAllScheduledScripts();

			// Create two scheduled scripts as admin
			adminScheduledScripts = await createManyScheduledScripts([
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
			analyst = await createOneUser(data);
			analystAuth = await login(analyst.username, data.password);

			// Create three scheduled scripts as analyst
			const createManyScheduledScriptsAsAnalyst = makeCreateManyScheduledScripts({
				...(await TEST_BASE_API_CONTEXT()),
				authToken: analystAuth,
			});

			analystScheduledScripts = await createManyScheduledScriptsAsAnalyst([
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
			'Returns all my scheduled scripts',
			integrationTest(async () => {
				const actualAdminScheduledScripts = await getScheduledScriptsAuthorizedToMe();
				expect(sortBy(actualAdminScheduledScripts, s => s.id)).toEqual(sortBy(adminScheduledScripts, s => s.id));
				for (const scheduledScript of actualAdminScheduledScripts) {
					expect(isScheduledScript(scheduledScript)).toBeTrue();
				}

				const getScheduledScriptsAuthorizedToAnalyst = makeGetScheduledScriptsAuthorizedToMe({
					...(await TEST_BASE_API_CONTEXT()),
					authToken: analystAuth,
				});

				const actualAnalystScheduledScripts = await getScheduledScriptsAuthorizedToAnalyst();
				expect(sortBy(actualAnalystScheduledScripts, s => s.id)).toEqual(sortBy(analystScheduledScripts, s => s.id));
				for (const scheduledScript of actualAnalystScheduledScripts) {
					expect(isScheduledScript(scheduledScript)).toBeTrue();
				}

				const allScheduledScripts = await getAllScheduledScripts();
				expect(sortBy(allScheduledScripts, s => s.id)).toEqual(
					sortBy([...analystScheduledScripts, ...adminScheduledScripts], s => s.id),
				);
				for (const scheduledScript of allScheduledScripts) {
					expect(isScheduledScript(scheduledScript)).toBeTrue();
				}
			}),
		);
	}),
);
