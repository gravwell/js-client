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
import { makeSystemIsConnected } from './system-is-connected';

describe('systemIsConnected()', () => {
	let systemIsConnected: ReturnType<typeof makeSystemIsConnected>;
	beforeAll(async () => {
		systemIsConnected = makeSystemIsConnected(await TEST_BASE_API_CONTEXT());
	});

	it(
		'Should tell if the system is connect',
		integrationTest(async () => {
			const isConnected = await systemIsConnected();
			expect(isConnected).toBeTrue();
		}),
	);
});
