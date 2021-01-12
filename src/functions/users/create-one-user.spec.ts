/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { random } from 'lodash';
import { CreatableUser, isValidUser } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeCreateOneUser } from './create-one-user';
import { makeGetOneUser } from './get-one-user';

describe('createOneUser()', () => {
	const createOneUser = makeCreateOneUser({ host: TEST_HOST, useEncryption: false });
	const getOneUser = makeGetOneUser({ host: TEST_HOST, useEncryption: false });

	it(
		"Should create a user and return it's id",
		integrationTest(async () => {
			const username = 'test-user-' + random(0, Number.MAX_SAFE_INTEGER);
			const data: CreatableUser = {
				name: 'Test',
				email: username + '@example.com',
				password: 'changeme',
				role: 'analyst',
				user: username,
			};

			const userID = await createOneUser(TEST_AUTH_TOKEN, data);
			const user = await getOneUser(TEST_AUTH_TOKEN, userID);
			expect(isValidUser(user)).toBeTrue();
		}),
	);
});
