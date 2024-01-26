/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableMacro } from '~/models/macro/creatable-macro';
import { isMacro } from '~/models/macro/is-macro';
import { Macro } from '~/models/macro/macro';
import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { integrationTest, integrationTestSpecDef } from '~/tests/test-types';
import { makeCreateOneMacro } from './create-one-macro';
import { makeDeleteOneMacro } from './delete-one-macro';
import { makeGetAllMacros } from './get-all-macros';
import { makeGetOneMacro } from './get-one-macro';

describe(
	'getOneMacro()',
	integrationTestSpecDef(() => {
		let getOneMacro: ReturnType<typeof makeGetOneMacro>;
		beforeAll(async () => {
			getOneMacro = makeGetOneMacro(await TEST_BASE_API_CONTEXT());
		});
		let createOneMacro: ReturnType<typeof makeCreateOneMacro>;
		beforeAll(async () => {
			createOneMacro = makeCreateOneMacro(await TEST_BASE_API_CONTEXT());
		});
		let getAllMacros: ReturnType<typeof makeGetAllMacros>;
		beforeAll(async () => {
			getAllMacros = makeGetAllMacros(await TEST_BASE_API_CONTEXT());
		});
		let deleteOneMacro: ReturnType<typeof makeDeleteOneMacro>;
		beforeAll(async () => {
			deleteOneMacro = makeDeleteOneMacro(await TEST_BASE_API_CONTEXT());
		});

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
	}),
);
