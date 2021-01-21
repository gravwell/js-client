/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isRemoteKit } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeGetAllRemoteKits } from './get-all-remote-kits';

describe('getAllRemoteKits()', () => {
	const getAllRemoteKits = makeGetAllRemoteKits({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });

	it(
		'Should return all available kits from the remote server',
		integrationTest(async () => {
			const kits = await getAllRemoteKits();
			expect(kits.length).toBeGreaterThan(5);
			expect(kits.every(isRemoteKit)).toBeTrue();
		}),
	);
});
