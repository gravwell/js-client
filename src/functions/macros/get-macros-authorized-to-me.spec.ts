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
import { TEST_BASE_API_CONTEXT } from '../../tests/config';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeCreateOneUser } from '../users';
import { makeCreateOneMacro } from './create-one-macro';
import { makeDeleteOneMacro } from './delete-one-macro';
import { makeGetAllMacros } from './get-all-macros';
import { makeGetMacrosAuthorizedToMe } from './get-macros-authorized-to-me';

describe('getMacrosAuthorizedToMe()', () => {
	const getMacrosAuthorizedToMe = makeGetMacrosAuthorizedToMe(TEST_BASE_API_CONTEXT);
	const createOneMacro = makeCreateOneMacro(TEST_BASE_API_CONTEXT);
	const deleteOneMacro = makeDeleteOneMacro(TEST_BASE_API_CONTEXT);
	const getAllMacros = makeGetAllMacros(TEST_BASE_API_CONTEXT);
	const createOneUser = makeCreateOneUser(TEST_BASE_API_CONTEXT);
	const login = makeLoginOneUser(TEST_BASE_API_CONTEXT);

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
		analyst = await createOneUser(data);
		analystAuth = await login(analyst.username, data.password);

		// Create three macros as analyst
		const creatableMacros2: Array<CreatableMacro> = [
			{ name: 'M3', expansion: 'abc' },
			{ name: 'M4', expansion: 'def' },
			{ name: 'M5', expansion: 'ghi' },
		];

		const createOneMacroAsAnalyst = makeCreateOneMacro({
			...TEST_BASE_API_CONTEXT,
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
				...TEST_BASE_API_CONTEXT,
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
