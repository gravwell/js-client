/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableMacro, isMacro } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneMacro } from './create-one-macro';
import { makeDeleteOneMacro } from './delete-one-macro';
import { makeGetOneMacro } from './get-one-macro';

describe('createOneMacro()', () => {
	let createOneMacro: ReturnType<typeof makeCreateOneMacro>;
	beforeAll(async () => {
		createOneMacro = makeCreateOneMacro(await TEST_BASE_API_CONTEXT());
	});
	let getOneMacro: ReturnType<typeof makeGetOneMacro>;
	beforeAll(async () => {
		getOneMacro = makeGetOneMacro(await TEST_BASE_API_CONTEXT());
	});
	let deleteOneMacro: ReturnType<typeof makeDeleteOneMacro>;
	beforeAll(async () => {
		deleteOneMacro = makeDeleteOneMacro(await TEST_BASE_API_CONTEXT());
	});

	it(
		'Should create a macro and return it',
		integrationTest(async () => {
			const data: CreatableMacro = {
				name: 'MACRO_A',
				expansion: 'tag=netflow',
			};

			const macro = await createOneMacro(data);
			expect(isMacro(macro)).toBeTrue();

			await expectAsync(deleteOneMacro(macro.id)).toBeResolved();
			await expectAsync(getOneMacro(macro.id)).toBeRejected();
		}),
	);
});
