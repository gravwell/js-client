/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeGetOneScriptLibrary } from './get-one-script-library';

describe('getOneScriptLibrary()', () => {
	const getOneScriptLibrary = makeGetOneScriptLibrary({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
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
