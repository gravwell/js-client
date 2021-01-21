/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest } from '../../tests';
import { TEST_BASE_API_CONTEXT } from '../../tests/config';
import { makeSetLogLevel } from './set-log-level';

describe('setLogLevel()', () => {
	const setLogLevel = makeSetLogLevel(TEST_BASE_API_CONTEXT);

	it(
		'Should set the current active log level',
		integrationTest(async () => {
			await setLogLevel('web access');
		}),
	);
});
