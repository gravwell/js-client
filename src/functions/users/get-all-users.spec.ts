/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isValidUser } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeGetAllUsers } from './get-all-users';

describe('getAllUsers()', () => {
	let getAllUsers: ReturnType<typeof makeGetAllUsers>;
	beforeAll(async () => {
		getAllUsers = makeGetAllUsers(await TEST_BASE_API_CONTEXT());
	});

	it(
		'Should return users',
		integrationTest(async () => {
			const users = await getAllUsers();
			expect(users.every(isValidUser)).toBeTrue();
		}),
	);
});
