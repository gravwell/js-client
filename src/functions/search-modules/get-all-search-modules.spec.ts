/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isSearchModule } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeGetAllSearchModules } from './get-all-search-modules';

describe('getAllSearchModules()', () => {
	const getAllSearchModules = makeGetAllSearchModules({
		host: TEST_HOST,
		useEncryption: false,
	});

	it(
		'Should return all search modules',
		integrationTest(async () => {
			const searchModules = await getAllSearchModules(TEST_AUTH_TOKEN);
			expect(searchModules.length).toBeGreaterThan(20);
			expect(searchModules.every(isSearchModule)).toBeTrue();
		}),
	);
});
