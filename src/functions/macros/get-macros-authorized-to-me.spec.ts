/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { random, sortBy } from 'lodash';
import { CreatableMacro, CreatableUser, isMacro, Macro, User } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeCreateOneUser, makeGetOneUser } from '../users';
import { makeCreateOneMacro } from './create-one-macro';
import { makeDeleteOneMacro } from './delete-one-macro';
import { makeGetAllMacros } from './get-all-macros';
import { makeGetMacrosAuthorizedToMe } from './get-macros-authorized-to-me';

describe('getMacrosAuthorizedToMe()', () => {
	const getMacrosAuthorizedToMe = makeGetMacrosAuthorizedToMe({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const createOneMacro = makeCreateOneMacro({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const deleteOneMacro = makeDeleteOneMacro({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const getAllMacros = makeGetAllMacros({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const getOneUser = makeGetOneUser({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const createOneUser = makeCreateOneUser({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const login = makeLoginOneUser({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });

	let adminMacros: Array<Macro>;

	let analyst: User;
	let analystAuth: string;
	let analystMacros: Array<Macro>;

	beforeEach(async () => {
		// Delete all macros
		const currentMacros = await getAllMacros();
		const currentMacroIDs = currentMacros.map(m => m.id);
		const deletePromises = currentMacroIDs.map(macroID => deleteOneMacro(macroID));
		await Promise.all(deletePromises);

		// Create two macros as admin
		const creatableMacros: Array<CreatableMacro> = [
			{ name: 'M1', expansion: 'abc' },
			{ name: 'M2', expansion: 'def' },
		];
		const createPromises = creatableMacros.map(creatable => createOneMacro(creatable));
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
		const userID = await createOneUser(data);
		analyst = await getOneUser(userID);
		analystAuth = await login(analyst.username, data.password);

		// Create three macros as analyst
		const creatableMacros2: Array<CreatableMacro> = [
			{ name: 'M3', expansion: 'abc' },
			{ name: 'M4', expansion: 'def' },
			{ name: 'M5', expansion: 'ghi' },
		];

		const createOneMacroAsAnalyst = makeCreateOneMacro({
			host: TEST_HOST,
			useEncryption: false,
			authToken: analystAuth,
		});

		const createPromises2 = creatableMacros2.map(creatable => createOneMacroAsAnalyst(creatable));
		analystMacros = await Promise.all(createPromises2);
	});

	it(
		'Returns all my macros',
		integrationTest(async () => {
			const actualAdminMacros = await getMacrosAuthorizedToMe();
			expect(sortBy(actualAdminMacros, m => m.id)).toEqual(sortBy(adminMacros, m => m.id));
			for (const macro of actualAdminMacros) expect(isMacro(macro)).toBeTrue();

			const getMacrosAuthorizedToAnalyst = makeGetMacrosAuthorizedToMe({
				host: TEST_HOST,
				useEncryption: false,
				authToken: analystAuth,
			});

			const actualAnalystMacros = await getMacrosAuthorizedToAnalyst();
			expect(sortBy(actualAnalystMacros, m => m.id)).toEqual(sortBy(analystMacros, m => m.id));
			for (const macro of actualAnalystMacros) expect(isMacro(macro)).toBeTrue();

			const allMacros = await getAllMacros();
			expect(sortBy(allMacros, m => m.id)).toEqual(sortBy([...analystMacros, ...adminMacros], m => m.id));
			for (const macro of allMacros) expect(isMacro(macro)).toBeTrue();
		}),
	);
});
