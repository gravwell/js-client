/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { userDecoder } from '~/models/user/is-valid-user';
import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { integrationTest } from '~/tests/test-types';
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
			expect(userDecoder.decode(user).ok).toBeTrue();
		}),
	);
});
