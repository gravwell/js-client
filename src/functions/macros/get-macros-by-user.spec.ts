/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { random } from 'lodash';
import { CreatableMacro } from '~/models/macro/creatable-macro';
import { isMacro } from '~/models/macro/is-macro';
import { CreatableUser } from '~/models/user/creatable-user';
import { User } from '~/models/user/user';
import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { integrationTest, integrationTestSpecDef } from '~/tests/test-types';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeCreateOneUser } from '../users/create-one-user';
import { assertIsNotNil } from '../utils/type-guards';
import { makeCreateOneMacro } from './create-one-macro';
import { makeDeleteOneMacro } from './delete-one-macro';
import { makeGetAllMacros } from './get-all-macros';
import { makeGetMacrosByUser } from './get-macros-by-user';

describe(
	'getMacrosByUser()',
	integrationTestSpecDef(() => {
		let getAllMacros: ReturnType<typeof makeGetAllMacros>;
		beforeAll(async () => {
			getAllMacros = makeGetAllMacros(await TEST_BASE_API_CONTEXT());
		});
		let getMacrosByUser: ReturnType<typeof makeGetMacrosByUser>;
		beforeAll(async () => {
			getMacrosByUser = makeGetMacrosByUser(await TEST_BASE_API_CONTEXT());
		});
		let createOneUser: ReturnType<typeof makeCreateOneUser>;
		beforeAll(async () => {
			createOneUser = makeCreateOneUser(await TEST_BASE_API_CONTEXT());
		});
		let login: ReturnType<typeof makeLoginOneUser>;
		beforeAll(async () => {
			login = makeLoginOneUser(await TEST_BASE_API_CONTEXT());
		});
		let createOneMacro: ReturnType<typeof makeCreateOneMacro>;
		beforeAll(async () => {
			createOneMacro = makeCreateOneMacro(await TEST_BASE_API_CONTEXT());
		});
		let deleteOneMacro: ReturnType<typeof makeDeleteOneMacro>;
		beforeAll(async () => {
			deleteOneMacro = makeDeleteOneMacro(await TEST_BASE_API_CONTEXT());
		});

		let user: User;
		let userAuth: string;

		beforeEach(async () => {
			// Delete all macros
			const currentMacros = await getAllMacros();
			const currentMacroIDs = currentMacros.map(m => m.id);
			const deletePromises = currentMacroIDs.map(macroID => deleteOneMacro(macroID));
			await Promise.all(deletePromises);

			// Create two macros as admin
			const creatableMacros1: Array<CreatableMacro> = [
				{ name: 'M1', expansion: 'abc' },
				{ name: 'M2', expansion: 'def' },
			];
			const createPromises1 = creatableMacros1.map(creatable => createOneMacro(creatable));
			await Promise.all(createPromises1);

			// Creates a user
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

			// Create three macros as analyst
			const creatableMacros2: Array<CreatableMacro> = [
				{ name: 'M3', expansion: 'abc' },
				{ name: 'M4', expansion: 'def' },
				{ name: 'M5', expansion: 'ghi' },
			];

			const createOneMacroAsAnalyst = makeCreateOneMacro({
				...(await TEST_BASE_API_CONTEXT()),
				authToken: userAuth,
			});

			const createPromises2 = creatableMacros2.map(creatable => createOneMacroAsAnalyst(creatable));
			await Promise.all(createPromises2);
		});

		xit(
			'Should return all macros of a user',
			integrationTest(async () => {
				const allMacros = await getAllMacros();
				const allMacroIDs = allMacros.map(m => m.id);
				const analystMacroIDs = allMacros.filter(m => m.userID === user.id).map(m => m.id);

				expect(allMacroIDs.length).toBe(5);
				expect(analystMacroIDs.length).toBe(3);

				const macros = await getMacrosByUser(user.id);
				expect(macros.length).toBe(analystMacroIDs.length);
				expect(macros.every(isMacro)).toBeTrue();
				expect(macros.map(m => m.id).sort()).toEqual(analystMacroIDs.sort());
			}),
		);

		xit(
			'Should return an empty array if the user has no macros',
			integrationTest(async () => {
				// Delete all macros
				const currentMacros = await getAllMacros();
				const currentMacroIDs = currentMacros.map(m => m.id);
				const deletePromises = currentMacroIDs.map(macroID => deleteOneMacro(macroID));
				await Promise.all(deletePromises);

				const macros = await getMacrosByUser(user.id);
				expect(macros.length).toBe(0);
			}),
		);

		xit(
			'Blocks non admin users from grabbing macros from other users other than themselves',
			integrationTest(async () => {
				const allMacros = await getAllMacros();
				const allMacroIDs = allMacros.map(m => m.id);
				const analystMacroIDs = allMacros.filter(m => m.userID === user.id).map(m => m.id);
				const adminID = allMacros.filter(m => m.userID !== user.id)[0]?.userID;
				assertIsNotNil(adminID);

				expect(allMacroIDs.length).toBe(5);
				expect(analystMacroIDs.length).toBe(3);

				const getMacrosByUserAsAnalyst = makeGetMacrosByUser({
					...(await TEST_BASE_API_CONTEXT()),
					authToken: userAuth,
				});

				const macrosSelf = await getMacrosByUserAsAnalyst(user.id);
				expect(macrosSelf.length).toBe(analystMacroIDs.length);
				expect(macrosSelf.every(isMacro)).toBeTrue();
				expect(macrosSelf.map(m => m.id).sort()).toEqual(analystMacroIDs.sort());

				await expectAsync(getMacrosByUserAsAnalyst(adminID)).toBeRejected();
			}),
		);
	}),
);
