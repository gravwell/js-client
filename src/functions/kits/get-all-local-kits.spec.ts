/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isLocalKit } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_BASE_API_CONTEXT } from '../../tests/config';
import { makeGetAllLocalKits } from './get-all-local-kits';

describe('getAllLocalKits()', () => {
	const getAllLocalKits = makeGetAllLocalKits(TEST_BASE_API_CONTEXT);

	it(
		'Should return all kits in the system',
		integrationTest(async () => {
			const kits = await getAllLocalKits();
			expect(kits.every(isLocalKit)).toBeTrue();
		}),
	);
});
