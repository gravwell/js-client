/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeGetOneUserPreferences } from './get-one-user-preferences';

describe('getOneUserPreferences()', () => {
	let getOneUserPreferences: ReturnType<typeof makeGetOneUserPreferences>;
	beforeAll(async () => {
		getOneUserPreferences = makeGetOneUserPreferences(await TEST_BASE_API_CONTEXT());
	});

	it(
		'Should return 200 with the user preferences',
		integrationTest(async () => {
			const userID = '1';
			await getOneUserPreferences(userID);
		}),
	);
});
