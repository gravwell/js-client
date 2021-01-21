/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeGetOneUserPreferences } from './get-one-user-preferences';

describe('getOneUserPreferences()', () => {
	const getOneUserPreferences = makeGetOneUserPreferences({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});

	it(
		'Should return 200 with the user preferences',
		integrationTest(async () => {
			const userID = '1';
			await getOneUserPreferences(userID);
		}),
	);
});
