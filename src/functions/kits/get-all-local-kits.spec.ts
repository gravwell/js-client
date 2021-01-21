/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isLocalKit } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeGetAllLocalKits } from './get-all-local-kits';

describe('getAllLocalKits()', () => {
	const getAllLocalKits = makeGetAllLocalKits({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });

	it(
		'Should return all kits in the system',
		integrationTest(async () => {
			const kits = await getAllLocalKits();
			expect(kits.every(isLocalKit)).toBeTrue();
		}),
	);
});
