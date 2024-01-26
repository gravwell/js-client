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
import { makeWebServerIsDistributed } from './web-server-is-distributed';

describe('webServerIsDistributed()', () => {
	let webServerIsDistributed: ReturnType<typeof makeWebServerIsDistributed>;
	beforeAll(async () => {
		webServerIsDistributed = makeWebServerIsDistributed(await TEST_BASE_API_CONTEXT());
	});

	xit(
		'Should tell if the web server is distributed',
		integrationTest(async () => {
			const isDistributed = await webServerIsDistributed();
			expect(isDistributed).toBeFalse();
		}),
	);
});
