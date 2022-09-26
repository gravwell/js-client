/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableMacro } from '~/models';
import { integrationTest, integrationTestSpecDef, sleep, TEST_BASE_API_CONTEXT } from '~/tests';
import { assertIsNotNil } from '../utils/type-guards';
import { makeCreateOneMacro } from './create-one-macro';
import { makeDeleteOneMacro } from './delete-one-macro';
import { makeGetAllMacros } from './get-all-macros';
import { makeGetOneMacro } from './get-one-macro';

describe(
	'deleteOneMacro()',
	integrationTestSpecDef(() => {
		let createOneMacro: ReturnType<typeof makeCreateOneMacro>;
		beforeAll(async () => {
			createOneMacro = makeCreateOneMacro(await TEST_BASE_API_CONTEXT());
		});
		let deleteOneMacro: ReturnType<typeof makeDeleteOneMacro>;
		beforeAll(async () => {
			deleteOneMacro = makeDeleteOneMacro(await TEST_BASE_API_CONTEXT());
		});
		let getAllMacros: ReturnType<typeof makeGetAllMacros>;
		beforeAll(async () => {
			getAllMacros = makeGetAllMacros(await TEST_BASE_API_CONTEXT());
		});
		let getOneMacro: ReturnType<typeof makeGetOneMacro>;
		beforeAll(async () => {
			getOneMacro = makeGetOneMacro(await TEST_BASE_API_CONTEXT());
		});

		beforeEach(async () => {
			// Delete all macros
			const currentMacros = await getAllMacros();
			const currentMacroIDs = currentMacros.map(m => m.id);
			const deletePromises = currentMacroIDs.map(macroID => deleteOneMacro(macroID));
			await Promise.all(deletePromises);

			// Create two macros
			const creatableMacros: Array<CreatableMacro> = [
				{ name: 'M1', expansion: 'abc' },
				{ name: 'M2', expansion: 'def' },
			];
			const createPromises = creatableMacros.map(creatable => createOneMacro(creatable));
			await Promise.all(createPromises);

			// There appears to be a race with the backend to create the macros.
			await sleep(3000);
		});

		it(
			'Should delete a macro',
			integrationTest(async () => {
				const currentMacros = await getAllMacros();
				const currentMacroIDs = currentMacros.map(m => m.id);
				expect(currentMacroIDs.length).toBe(2);

				const deleteMacroID = currentMacroIDs[0];
				assertIsNotNil(deleteMacroID);
				await deleteOneMacro(deleteMacroID);
				await expectAsync(getOneMacro(deleteMacroID)).toBeRejected();

				const remainingMacros = await getAllMacros();
				const remainingMacroIDs = remainingMacros.map(m => m.id);
				expect(remainingMacroIDs).not.toContain(deleteMacroID);
				expect(remainingMacroIDs.length).toBe(1);
			}),
		);
	}),
);
