/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableMacro, isMacro, Macro } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneMacro } from './create-one-macro';
import { makeDeleteOneMacro } from './delete-one-macro';
import { makeGetAllMacros } from './get-all-macros';
import { makeGetOneMacro } from './get-one-macro';

describe('getOneMacro()', () => {
	const getOneMacro = makeGetOneMacro(TEST_BASE_API_CONTEXT);
	const createOneMacro = makeCreateOneMacro(TEST_BASE_API_CONTEXT);
	const getAllMacros = makeGetAllMacros(TEST_BASE_API_CONTEXT);
	const deleteOneMacro = makeDeleteOneMacro(TEST_BASE_API_CONTEXT);

	let createdMacro: Macro;

	beforeEach(async () => {
		// Delete all macros
		const currentMacros = await getAllMacros();
		const currentMacroIDs = currentMacros.map(m => m.id);
		const deletePromises = currentMacroIDs.map(macroID => deleteOneMacro(macroID));
		await Promise.all(deletePromises);

		// Create on macro
		const data: CreatableMacro = {
			name: 'TEST',
			expansion: 'test',
		};
		createdMacro = await createOneMacro(data);
	});

	it(
		'Returns a macro',
		integrationTest(async () => {
			const macro = await getOneMacro(createdMacro.id);
			expect(isMacro(macro)).toBeTrue();
			expect(macro).toEqual(createdMacro);
		}),
	);

	it(
		"Returns an error if the macro doesn't exist",
		integrationTest(async () => {
			await expectAsync(getOneMacro('non-existent')).toBeRejected();
		}),
	);
});
