/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isValidUser } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeGetMyUser } from './get-my-user';

describe('getMyUser()', () => {
	const getMyUser = makeGetMyUser({ host: TEST_HOST, useEncryption: false });

	it(
		'Should return a user',
		integrationTest(async () => {
			const user = await getMyUser(TEST_AUTH_TOKEN);
			expect(isValidUser(user)).toBeTrue();
		}),
	);
});
