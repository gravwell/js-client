/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isSystemSettings } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeGetSystemSettings } from './get-system-settings';

describe('getSystemSettings()', () => {
	const getSystemSettings = makeGetSystemSettings({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});

	it(
		'Should get the system settings',
		integrationTest(async () => {
			const settings = await getSystemSettings();
			expect(isSystemSettings(settings)).toBeTrue();
		}),
	);
});
