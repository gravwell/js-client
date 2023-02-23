/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { random } from 'lodash';
import { CreatableUser, isValidUser } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneUser } from './create-one-user';
import { makeDeleteOneUser } from './delete-one-user';
import { makeGetOneUser } from './get-one-user';

describe('deleteOneUser()', () => {
	let deleteOneUser: ReturnType<typeof makeDeleteOneUser>;
	beforeAll(async () => {
		deleteOneUser = makeDeleteOneUser(await TEST_BASE_API_CONTEXT());
	});
	let createOneUser: ReturnType<typeof makeCreateOneUser>;
	beforeAll(async () => {
		createOneUser = makeCreateOneUser(await TEST_BASE_API_CONTEXT());
	});
	let getOneUser: ReturnType<typeof makeGetOneUser>;
	beforeAll(async () => {
		getOneUser = makeGetOneUser(await TEST_BASE_API_CONTEXT());
	});

	xit(
		'Should delete a user',
		integrationTest(async () => {
			const username = 'test-user-' + random(0, Number.MAX_SAFE_INTEGER);
			const data: CreatableUser = {
				name: 'Test',
				email: username + '@example.com',
				password: 'changeme',
				role: 'analyst',
				username,
			};

			const user = await createOneUser(data);
			expect(isValidUser(user)).toBeTrue();

			await deleteOneUser(user.id);
			await expectAsync(getOneUser(user.id)).toBeRejected();
		}),
	);
});
