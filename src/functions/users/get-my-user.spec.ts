/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isValidUser } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeGetMyUser } from './get-my-user';

describe('getMyUser()', () => {
	let getMyUser: ReturnType<typeof makeGetMyUser>;
	beforeAll(async () => {
		getMyUser = makeGetMyUser(await TEST_BASE_API_CONTEXT());
	});

	it(
		'Should return a user',
		integrationTest(async () => {
			const user = await getMyUser();
			expect(isValidUser(user)).toBeTrue();
		}),
	);
});
