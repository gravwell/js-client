/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isLogLevel, LogLevel } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeGetLogLevels } from './get-log-levels';

describe('getLogLevels()', () => {
	const getLogLevels = makeGetLogLevels(TEST_BASE_API_CONTEXT);

	xit(
		'Should get all available log levels and the current active log level',
		integrationTest(async () => {
			const { available, current } = await getLogLevels();
			const _isValidLogLevel = (value: any): value is LogLevel | 'off' => value === 'off' || isLogLevel(value);
			expect(_isValidLogLevel(current)).toBeTrue();
			expect(available.every(_isValidLogLevel)).toBeTrue();
		}),
	);
});
