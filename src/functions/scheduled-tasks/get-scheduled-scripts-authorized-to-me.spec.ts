/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { random, sortBy } from 'lodash';
import { CreatableUser, isScheduledScript, ScheduledScript, User } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeCreateOneUser, makeGetOneUser } from '../users';
import { makeCreateManyScheduledScripts } from './create-many-scheduled-scripts';
import { makeDeleteAllScheduledScripts } from './delete-all-scheduled-scripts';
import { makeGetAllScheduledScripts } from './get-all-scheduled-scripts';
import { makeGetScheduledScriptsAuthorizedToMe } from './get-scheduled-scripts-authorized-to-me';

describe('getScheduledScriptsAuthorizedToMe()', () => {
	const getScheduledScriptsAuthorizedToMe = makeGetScheduledScriptsAuthorizedToMe({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const getAllScheduledScripts = makeGetAllScheduledScripts({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const getOneUser = makeGetOneUser({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const createOneUser = makeCreateOneUser({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const login = makeLoginOneUser({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
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
		const userID = await createOneUser(data);
		analyst = await getOneUser(userID);
		analystAuth = await login(analyst.username, data.password);

		// Create three scheduled scripts as analyst
		analystScheduledScripts = await createManyScheduledScripts(analystAuth, [
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
		'Returns all my scheduled scripts',
		integrationTest(async () => {
			const actualAdminScheduledScripts = await getScheduledScriptsAuthorizedToMe();
			expect(sortBy(actualAdminScheduledScripts, s => s.id)).toEqual(sortBy(adminScheduledScripts, s => s.id));
			for (const scheduledScript of actualAdminScheduledScripts) expect(isScheduledScript(scheduledScript)).toBeTrue();

			const actualAnalystScheduledScripts = await getScheduledScriptsAuthorizedToMe(analystAuth);
			expect(sortBy(actualAnalystScheduledScripts, s => s.id)).toEqual(sortBy(analystScheduledScripts, s => s.id));
			for (const scheduledScript of actualAnalystScheduledScripts)
				expect(isScheduledScript(scheduledScript)).toBeTrue();

			const allScheduledScripts = await getAllScheduledScripts();
			expect(sortBy(allScheduledScripts, s => s.id)).toEqual(
				sortBy([...analystScheduledScripts, ...adminScheduledScripts], s => s.id),
			);
			for (const scheduledScript of allScheduledScripts) expect(isScheduledScript(scheduledScript)).toBeTrue();
		}),
	);
});
