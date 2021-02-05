/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { random } from 'lodash';
import { CreatableMacro, CreatableUser, isMacro, User } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeCreateOneUser } from '../users';
import { makeCreateOneMacro } from './create-one-macro';
import { makeDeleteOneMacro } from './delete-one-macro';
import { makeGetAllMacros } from './get-all-macros';
import { makeGetMacrosByUser } from './get-macros-by-user';

describe('getMacrosByUser()', () => {
	const getAllMacros = makeGetAllMacros(TEST_BASE_API_CONTEXT);
	const getMacrosByUser = makeGetMacrosByUser(TEST_BASE_API_CONTEXT);
	const createOneUser = makeCreateOneUser(TEST_BASE_API_CONTEXT);
	const login = makeLoginOneUser(TEST_BASE_API_CONTEXT);
	const createOneMacro = makeCreateOneMacro(TEST_BASE_API_CONTEXT);
	const deleteOneMacro = makeDeleteOneMacro(TEST_BASE_API_CONTEXT);

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
			user: userSeed,
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
			...TEST_BASE_API_CONTEXT,
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
			const adminID = allMacros.filter(m => m.userID !== user.id)[0].userID;

			expect(allMacroIDs.length).toBe(5);
			expect(analystMacroIDs.length).toBe(3);

			const getMacrosByUserAsAnalyst = makeGetMacrosByUser({
				...TEST_BASE_API_CONTEXT,
				authToken: userAuth,
			});

			const macrosSelf = await getMacrosByUserAsAnalyst(user.id);
			expect(macrosSelf.length).toBe(analystMacroIDs.length);
			expect(macrosSelf.every(isMacro)).toBeTrue();
			expect(macrosSelf.map(m => m.id).sort()).toEqual(analystMacroIDs.sort());

			await expectAsync(getMacrosByUserAsAnalyst(adminID)).toBeRejected();
		}),
	);
});
