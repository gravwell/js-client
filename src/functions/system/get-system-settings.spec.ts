/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isSystemSettings } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeGetSystemSettings } from './get-system-settings';

describe('getSystemSettings()', () => {
	let getSystemSettings: ReturnType<typeof makeGetSystemSettings>;
	beforeAll(async () => {
		getSystemSettings = makeGetSystemSettings(await TEST_BASE_API_CONTEXT());
	});

	it(
		'Should get the system settings',
		integrationTest(async () => {
			const settings = await getSystemSettings();
			expect(isSystemSettings(settings)).toBeTrue();
		}),
	);
});
