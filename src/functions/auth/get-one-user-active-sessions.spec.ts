/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { integrationTest } from '~/tests/test-types';
import { makeGetOneUserActiveSessions } from './get-one-user-active-sessions';

describe('getOneUserActiveSessions', () => {
	let getOneUserActiveSessions: ReturnType<typeof makeGetOneUserActiveSessions>;
	beforeAll(async () => {
		getOneUserActiveSessions = makeGetOneUserActiveSessions(await TEST_BASE_API_CONTEXT());
	});

	it(
		'Should return an array of sessions',
		integrationTest(async () => {
			const data = await getOneUserActiveSessions('1');
			expect(data.sessions.length).toBeGreaterThanOrEqual(1);
		}),
	);
});
