/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableMacro, isMacro } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_BASE_API_CONTEXT } from '../../tests/config';
import { makeCreateOneMacro } from './create-one-macro';
import { makeDeleteOneMacro } from './delete-one-macro';
import { makeGetOneMacro } from './get-one-macro';

describe('createOneMacro()', () => {
	const createOneMacro = makeCreateOneMacro(TEST_BASE_API_CONTEXT);
	const getOneMacro = makeGetOneMacro(TEST_BASE_API_CONTEXT);
	const deleteOneMacro = makeDeleteOneMacro(TEST_BASE_API_CONTEXT);

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
