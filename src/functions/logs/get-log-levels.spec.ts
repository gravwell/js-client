/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isLogLevel, LogLevel } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeGetLogLevels } from './get-log-levels';

describe('getLogLevels()', () => {
	const getLogLevels = makeGetLogLevels({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });

	it(
		'Should get all available log levels and the current active log level',
		integrationTest(async () => {
			const { available, current } = await getLogLevels();
			const _isValidLogLevel = (value: any): value is LogLevel | 'off' => value === 'off' || isLogLevel(value);
			expect(_isValidLogLevel(current)).toBeTrue();
			expect(available.every(_isValidLogLevel)).toBeTrue();
		}),
	);
});
