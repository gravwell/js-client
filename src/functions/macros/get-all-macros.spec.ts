/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableMacro, isMacro } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeCreateOneMacro } from './create-one-macro';
import { makeDeleteOneMacro } from './delete-one-macro';
import { makeGetAllMacros } from './get-all-macros';

describe('getAllMacros()', () => {
	const createOneMacro = makeCreateOneMacro({ host: TEST_HOST, useEncryption: false });
	const deleteOneMacro = makeDeleteOneMacro({ host: TEST_HOST, useEncryption: false });
	const getAllMacros = makeGetAllMacros({ host: TEST_HOST, useEncryption: false });

	beforeEach(async () => {
		// Delete all macros
		const currentMacros = await getAllMacros(TEST_AUTH_TOKEN);
		const currentMacroIDs = currentMacros.map(m => m.id);
		const deletePromises = currentMacroIDs.map(macroID => deleteOneMacro(TEST_AUTH_TOKEN, macroID));
		await Promise.all(deletePromises);
	});

	it(
		'Should return all macros',
		integrationTest(async () => {
			// Create two macros
			const creatableMacros: Array<CreatableMacro> = [
				{ name: 'M1', expansion: 'abc' },
				{ name: 'M2', expansion: 'def' },
			];
			const createPromises = creatableMacros.map(creatable => createOneMacro(TEST_AUTH_TOKEN, creatable));
			await Promise.all(createPromises);

			const macros = await getAllMacros(TEST_AUTH_TOKEN);
			expect(macros.length).toBe(2);
			expect(macros.every(isMacro)).toBeTrue();
		}),
	);

	it(
		'Should return an empty array if there are no macros',
		integrationTest(async () => {
			const macros = await getAllMacros(TEST_AUTH_TOKEN);
			expect(macros.length).toBe(0);
		}),
	);
});
