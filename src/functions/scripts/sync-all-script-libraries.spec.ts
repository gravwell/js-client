/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeSyncAllScriptLibraries } from './sync-all-script-libraries';

describe('syncAllScriptLibraries()', () => {
	const syncAllScriptLibraries = makeSyncAllScriptLibraries(TEST_BASE_API_CONTEXT);

	it(
		'Should update all libraries',
		integrationTest(async () => {
			await expectAsync(syncAllScriptLibraries()).toBeResolved();
		}),
	);
});
