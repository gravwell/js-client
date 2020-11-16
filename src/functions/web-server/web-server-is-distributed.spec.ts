/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeWebServerIsDistributed } from './web-server-is-distributed';

describe('webServerIsDistributed()', () => {
	const webServerIsDistributed = makeWebServerIsDistributed({ host: TEST_HOST, useEncryption: false });

	it(
		'Should tell if the web server is distributed',
		integrationTest(async () => {
			const isDistributed = await webServerIsDistributed(TEST_AUTH_TOKEN);
			expect(isDistributed).toBeFalse();
		}),
	);
});
