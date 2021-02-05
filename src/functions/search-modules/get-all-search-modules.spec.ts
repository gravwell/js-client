/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isSearchModule } from '~/models';
import { integrationTest } from '../../tests';
import { TEST_BASE_API_CONTEXT } from '../../tests/config';
import { makeGetAllSearchModules } from './get-all-search-modules';

describe('getAllSearchModules()', () => {
	const getAllSearchModules = makeGetAllSearchModules(TEST_BASE_API_CONTEXT);

	it(
		'Should return all search modules',
		integrationTest(async () => {
			const searchModules = await getAllSearchModules();
			expect(searchModules.length).toBeGreaterThan(20);
			expect(searchModules.every(isSearchModule)).toBeTrue();
		}),
	);
});
