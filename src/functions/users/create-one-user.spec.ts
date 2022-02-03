/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { random } from 'lodash';
import { CreatableUser, isValidUser, User } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneUser } from './create-one-user';
import { makeDeleteOneUser } from './delete-one-user';

describe('createOneUser()', () => {
	const createOneUser = makeCreateOneUser(TEST_BASE_API_CONTEXT);
	const deleteOneUser = makeDeleteOneUser(TEST_BASE_API_CONTEXT);

	let user: User;
	beforeEach(async () => {
		const username = 'test-user-' + random(0, Number.MAX_SAFE_INTEGER);
		const data: CreatableUser = {
			name: 'Test',
			email: username + '@example.com',
			password: 'changeme',
			role: 'analyst',
			user: username,
		};

		user = await createOneUser(data);
	});

	afterEach(async () => {
		await deleteOneUser(user.id);
	});

	it(
		"Should create a user and return it's id",
		integrationTest(async () => {
			expect(isValidUser(user)).toBeTrue();
		}),
	);

	it(
		'Should have the .searchGroupID property with default value',
		integrationTest(async () => {
			expect(user.searchGroupID).toBeNull();
		}),
	);
});
