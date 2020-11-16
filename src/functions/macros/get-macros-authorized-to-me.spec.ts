/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { random, sortBy } from 'lodash';
import { isMacro, Macro, User } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeLoginOneUser } from '../auth/login-one-user';
import { CreatableUser, makeCreateOneUser, makeGetOneUser } from '../users';
import { CreatableMacro, makeCreateOneMacro } from './create-one-macro';
import { makeDeleteOneMacro } from './delete-one-macro';
import { makeGetAllMacros } from './get-all-macros';
import { makeGetMacrosAuthorizedToMe } from './get-macros-authorized-to-me';

describe('getMacrosAuthorizedToMe()', () => {
	const getMacrosAuthorizedToMe = makeGetMacrosAuthorizedToMe({ host: TEST_HOST, useEncryption: false });
	const createOneMacro = makeCreateOneMacro({ host: TEST_HOST, useEncryption: false });
	const deleteOneMacro = makeDeleteOneMacro({ host: TEST_HOST, useEncryption: false });
	const getAllMacros = makeGetAllMacros({ host: TEST_HOST, useEncryption: false });
	const getOneUser = makeGetOneUser({ host: TEST_HOST, useEncryption: false });
	const createOneUser = makeCreateOneUser({ host: TEST_HOST, useEncryption: false });
	const login = makeLoginOneUser({ host: TEST_HOST, useEncryption: false });

	let adminMacros: Array<Macro>;

	let analyst: User;
	let analystAuth: string;
	let analystMacros: Array<Macro>;

	beforeEach(async () => {
		// Delete all macros
		const currentMacros = await getAllMacros(TEST_AUTH_TOKEN);
		const currentMacroIDs = currentMacros.map(m => m.id);
		const deletePromises = currentMacroIDs.map(macroID => deleteOneMacro(TEST_AUTH_TOKEN, macroID));
		await Promise.all(deletePromises);

		// Create two macros as admin
		const creatableMacros: Array<CreatableMacro> = [
			{ name: 'M1', expansion: 'abc' },
			{ name: 'M2', expansion: 'def' },
		];
		const createPromises = creatableMacros.map(creatable => createOneMacro(TEST_AUTH_TOKEN, creatable));
		adminMacros = await Promise.all(createPromises);

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
		analyst = await getOneUser(TEST_AUTH_TOKEN, userID);
		analystAuth = await login(analyst.username, data.password);

		// Create three macros as analyst
		const creatableMacros2: Array<CreatableMacro> = [
			{ name: 'M3', expansion: 'abc' },
			{ name: 'M4', expansion: 'def' },
			{ name: 'M5', expansion: 'ghi' },
		];
		const createPromises2 = creatableMacros2.map(creatable => createOneMacro(analystAuth, creatable));
		analystMacros = await Promise.all(createPromises2);
	});

	it(
		'Returns all my macros',
		integrationTest(async () => {
			const actualAdminMacros = await getMacrosAuthorizedToMe(TEST_AUTH_TOKEN);
			expect(sortBy(actualAdminMacros, m => m.id)).toEqual(sortBy(adminMacros, m => m.id));
			for (const macro of actualAdminMacros) expect(isMacro(macro)).toBeTrue();

			const actualAnalystMacros = await getMacrosAuthorizedToMe(analystAuth);
			expect(sortBy(actualAnalystMacros, m => m.id)).toEqual(sortBy(analystMacros, m => m.id));
			for (const macro of actualAnalystMacros) expect(isMacro(macro)).toBeTrue();

			const allMacros = await getAllMacros(TEST_AUTH_TOKEN);
			expect(sortBy(allMacros, m => m.id)).toEqual(sortBy([...analystMacros, ...adminMacros], m => m.id));
			for (const macro of allMacros) expect(isMacro(macro)).toBeTrue();
		}),
	);
});
