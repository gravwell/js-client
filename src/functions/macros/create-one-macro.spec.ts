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
import { makeGetOneMacro } from './get-one-macro';

describe('createOneMacro()', () => {
	const createOneMacro = makeCreateOneMacro({ host: TEST_HOST, useEncryption: false });
	const getOneMacro = makeGetOneMacro({ host: TEST_HOST, useEncryption: false });
	const deleteOneMacro = makeDeleteOneMacro({ host: TEST_HOST, useEncryption: false });

	it(
		'Should create a macro and return it',
		integrationTest(async () => {
			const data: CreatableMacro = {
				name: 'MACRO_A',
				expansion: 'tag=netflow',
			};

			const macro = await createOneMacro(TEST_AUTH_TOKEN, data);
			expect(isMacro(macro)).toBeTrue();

			await expectAsync(deleteOneMacro(TEST_AUTH_TOKEN, macro.id)).toBeResolved();
			await expectAsync(getOneMacro(TEST_AUTH_TOKEN, macro.id)).toBeRejected();
		}),
	);
});
