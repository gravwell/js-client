/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeSyncAllScriptLibraries } from './sync-all-script-libraries';

describe('syncAllScriptLibraries()', () => {
	const syncAllScriptLibraries = makeSyncAllScriptLibraries({
		host: TEST_HOST,
		useEncryption: false,
	});

	it(
		'Should update all libraries',
		integrationTest(async () => {
			await expectAsync(syncAllScriptLibraries(TEST_AUTH_TOKEN)).toBeResolved();
		}),
	);
});
