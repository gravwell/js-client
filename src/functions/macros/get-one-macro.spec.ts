/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isMacro, Macro } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { CreatableMacro, makeCreateOneMacro } from './create-one-macro';
import { makeDeleteOneMacro } from './delete-one-macro';
import { makeGetAllMacros } from './get-all-macros';
import { makeGetOneMacro } from './get-one-macro';

describe('getOneMacro()', () => {
	const getOneMacro = makeGetOneMacro({ host: TEST_HOST, useEncryption: false });
	const createOneMacro = makeCreateOneMacro({ host: TEST_HOST, useEncryption: false });
	const getAllMacros = makeGetAllMacros({ host: TEST_HOST, useEncryption: false });
	const deleteOneMacro = makeDeleteOneMacro({ host: TEST_HOST, useEncryption: false });

	let createdMacro: Macro;

	beforeEach(async () => {
		// Delete all macros
		const currentMacros = await getAllMacros(TEST_AUTH_TOKEN);
		const currentMacroIDs = currentMacros.map(m => m.id);
		const deletePromises = currentMacroIDs.map(macroID => deleteOneMacro(TEST_AUTH_TOKEN, macroID));
		await Promise.all(deletePromises);

		// Create on macro
		const data: CreatableMacro = {
			name: 'TEST',
			expansion: 'test',
		};
		createdMacro = await createOneMacro(TEST_AUTH_TOKEN, data);
	});

	it(
		'Returns a macro',
		integrationTest(async () => {
			const macro = await getOneMacro(TEST_AUTH_TOKEN, createdMacro.id);
			expect(isMacro(macro)).toBeTrue();
			expect(macro).toEqual(createdMacro);
		}),
	);

	it(
		"Returns an error if the macro doesn't exist",
		integrationTest(async () => {
			await expectAsync(getOneMacro(TEST_AUTH_TOKEN, 'non-existent')).toBeRejected();
		}),
	);
});
