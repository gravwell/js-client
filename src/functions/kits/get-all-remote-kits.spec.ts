/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isRemoteKit } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeGetAllRemoteKits } from './get-all-remote-kits';

describe('getAllRemoteKits()', () => {
	const getAllRemoteKits = makeGetAllRemoteKits(TEST_BASE_API_CONTEXT);

	xit(
		'Should return all available kits from the remote server',
		integrationTest(async () => {
			const kits = await getAllRemoteKits();
			expect(kits.length).toBeGreaterThan(5);
			expect(kits.every(isRemoteKit)).toBeTrue();
		}),
	);
});
