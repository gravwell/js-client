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
import { makeSyncAllScriptLibraries } from './sync-all-script-libraries';

describe('syncAllScriptLibraries()', () => {
	let syncAllScriptLibraries: ReturnType<typeof makeSyncAllScriptLibraries>;
	beforeAll(async () => {
		syncAllScriptLibraries = makeSyncAllScriptLibraries(await TEST_BASE_API_CONTEXT());
	});

	it(
		'Should update all libraries',
		integrationTest(async () => {
			await expectAsync(syncAllScriptLibraries()).toBeResolved();
		}),
	);
});
