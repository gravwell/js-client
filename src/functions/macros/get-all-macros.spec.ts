/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableMacro, isMacro } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneMacro } from './create-one-macro';
import { makeDeleteOneMacro } from './delete-one-macro';
import { makeGetAllMacros } from './get-all-macros';

describe('getAllMacros()', () => {
	const createOneMacro = makeCreateOneMacro(TEST_BASE_API_CONTEXT);
	const deleteOneMacro = makeDeleteOneMacro(TEST_BASE_API_CONTEXT);
	const getAllMacros = makeGetAllMacros(TEST_BASE_API_CONTEXT);

	beforeEach(async () => {
		// Delete all macros
		const currentMacros = await getAllMacros();
		const currentMacroIDs = currentMacros.map(m => m.id);
		const deletePromises = currentMacroIDs.map(macroID => deleteOneMacro(macroID));
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
			const createPromises = creatableMacros.map(creatable => createOneMacro(creatable));
			await Promise.all(createPromises);

			const macros = await getAllMacros();
			expect(macros.length).toBe(2);
			expect(macros.every(isMacro)).toBeTrue();
		}),
	);

	it(
		'Should return an empty array if there are no macros',
		integrationTest(async () => {
			const macros = await getAllMacros();
			expect(macros.length).toBe(0);
		}),
	);
});
