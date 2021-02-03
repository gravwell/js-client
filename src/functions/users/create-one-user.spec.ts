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
import { TEST_BASE_API_CONTEXT } from '../../tests/config';
import { makeCreateOneUser } from './create-one-user';

describe('createOneUser()', () => {
	const createOneUser = makeCreateOneUser(TEST_BASE_API_CONTEXT);

	xit(
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

			const user = await createOneUser(data);
			expect(isValidUser(user)).toBeTrue();
		}),
	);
});
