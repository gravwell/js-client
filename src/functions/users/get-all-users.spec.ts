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
import { makeGetAllUsers } from './get-all-users';

describe('getAllUsers()', () => {
	const getAllUsers = makeGetAllUsers({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });

	it(
		'Should return users',
		integrationTest(async () => {
			const users = await getAllUsers();
			expect(users.every(isValidUser)).toBeTrue();
		}),
	);
});
