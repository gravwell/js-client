/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeGetOneUserActiveSessions } from './get-one-user-active-sessions';

describe('getOneUserActiveSessions', () => {
	const getOneUserActiveSessions = makeGetOneUserActiveSessions({ host: TEST_HOST, useEncryption: false });

	it(
		'Should return an array of sessions',
		integrationTest(async () => {
			const data = await getOneUserActiveSessions(TEST_AUTH_TOKEN, '1');
			expect(data.sessions.length).toBeGreaterThanOrEqual(1);
		}),
	);
});
