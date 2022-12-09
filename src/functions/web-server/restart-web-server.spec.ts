/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeRestartWebServer } from './restart-web-server';

describe('restartWebServer()', () => {
	let restartWebServer: ReturnType<typeof makeRestartWebServer>;
	beforeAll(async () => {
		restartWebServer = makeRestartWebServer(await TEST_BASE_API_CONTEXT());
	});

	// !WARNING: This causes panic for the backend guys see gravwell/gravwell#2277
	xit(
		'Should restart the web server',
		integrationTest(async () => {
			// TODO: Ping it and expect OK
			await restartWebServer();
			// TODO: Ping it and expect no connection
			await new Promise(res => setTimeout(res, 5000));
			// TODO: Ping it and expect OK
		}),
		10000,
	);
});
