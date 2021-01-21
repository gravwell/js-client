/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeRestartWebServer } from './restart-web-server';

describe('restartWebServer()', () => {
	const restartWebServer = makeRestartWebServer({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });

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
