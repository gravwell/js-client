/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { omit } from 'lodash';
import { CreatableMacro, isMacro, Macro, UpdatableMacro } from '~/models';
import { integrationTest, integrationTestSpecDef, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneMacro } from './create-one-macro';
import { makeDeleteOneMacro } from './delete-one-macro';
import { makeGetAllMacros } from './get-all-macros';
import { makeUpdateOneMacro } from './update-one-macro';

describe(
	'updateOneMacro()',
	integrationTestSpecDef(() => {
		let createOneMacro: ReturnType<typeof makeCreateOneMacro>;
		beforeAll(async () => {
			createOneMacro = makeCreateOneMacro(await TEST_BASE_API_CONTEXT());
		});
		let updateOneMacro: ReturnType<typeof makeUpdateOneMacro>;
		beforeAll(async () => {
			updateOneMacro = makeUpdateOneMacro(await TEST_BASE_API_CONTEXT());
		});
		let deleteOneMacro: ReturnType<typeof makeDeleteOneMacro>;
		beforeAll(async () => {
			deleteOneMacro = makeDeleteOneMacro(await TEST_BASE_API_CONTEXT());
		});
		let getAllMacros: ReturnType<typeof makeGetAllMacros>;
		beforeAll(async () => {
			getAllMacros = makeGetAllMacros(await TEST_BASE_API_CONTEXT());
		});

		let createdMacro: Macro;

		beforeEach(async () => {
			// Delete all macros
			const currentMacros = await getAllMacros();
			const currentMacroIDs = currentMacros.map(m => m.id);
			const deletePromises = currentMacroIDs.map(macroID => deleteOneMacro(macroID));
			await Promise.all(deletePromises);

			// Create one macro
			const data: CreatableMacro = {
				name: 'CURRENT_NAME',
				expansion: 'Current expansion',
			};
			createdMacro = await createOneMacro(data);
		});

		const updateTests: Array<Omit<UpdatableMacro, 'id'>> = [
			{ name: 'NEW_NAME' },
			{ description: 'New description' },
			{ description: null },

			{ groupIDs: ['1'] },
			{ groupIDs: ['1', '2'] },
			{ groupIDs: [] },

			{ expansion: 'test expansion' },
		];
		updateTests.forEach((_data, testIndex) => {
			const updatedFields = Object.keys(omit(_data, ['uuid']));
			const formatedUpdatedFields = updatedFields.join(', ');
			const formatedTestIndex = (testIndex + 1).toString().padStart(2, '0');

			it(
				`Test ${formatedTestIndex}: Should update an macro ${formatedUpdatedFields} and return itself updated`,
				integrationTest(async () => {
					const current = createdMacro;
					expect(isMacro(current)).toBeTrue();

					const data: UpdatableMacro = { ..._data, id: current.id };
					const updated = await updateOneMacro(data);

					expect(isMacro(updated)).toBeTrue();
					expect(updated).toEqual({ ...current, ...data, lastUpdateDate: updated.lastUpdateDate });
				}),
			);
		});
	}),
);
