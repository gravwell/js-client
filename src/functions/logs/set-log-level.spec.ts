/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeSetLogLevel } from './set-log-level';

describe('setLogLevel()', () => {
	const setLogLevel = makeSetLogLevel({ host: TEST_HOST, useEncryption: false });

	it(
		'Should set the current active log level',
		integrationTest(async () => {
			await setLogLevel(TEST_AUTH_TOKEN, 'web access');
		}),
	);
});
