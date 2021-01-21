/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest } from '../../tests';
import { TEST_BASE_API_CONTEXT } from '../../tests/config';
import { makeGetOneUserActiveSessions } from './get-one-user-active-sessions';

describe('getOneUserActiveSessions', () => {
	const getOneUserActiveSessions = makeGetOneUserActiveSessions(TEST_BASE_API_CONTEXT);

	it(
		'Should return an array of sessions',
		integrationTest(async () => {
			const data = await getOneUserActiveSessions('1');
			expect(data.sessions.length).toBeGreaterThanOrEqual(1);
		}),
	);
});
