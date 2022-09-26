/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeGetOneScriptLibrary } from './get-one-script-library';

describe('getOneScriptLibrary()', () => {
	let getOneScriptLibrary: ReturnType<typeof makeGetOneScriptLibrary>;
	beforeAll(async () => {
		getOneScriptLibrary = makeGetOneScriptLibrary(await TEST_BASE_API_CONTEXT());
	});

	it(
		'Should return the code for a script library',
		integrationTest(async () => {
			const library = await getOneScriptLibrary('utils/links.ank');
			expect(typeof library).toBe('string');
			expect(library.length).toBeGreaterThan(40);
		}),
	);
});
