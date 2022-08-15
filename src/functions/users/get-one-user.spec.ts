/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isValidUser } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeGetOneUser } from './get-one-user';

describe('getOneUser()', () => {
	let getOneUser: ReturnType<typeof makeGetOneUser>;
	beforeAll(async () => {
		getOneUser = makeGetOneUser(await TEST_BASE_API_CONTEXT());
	});

	it(
		'Should return a user',
		integrationTest(async () => {
			const user = await getOneUser('1');
			expect(isValidUser(user)).toBeTrue();
		}),
	);
});
