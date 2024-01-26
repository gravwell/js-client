/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isSearch2 } from '~/models/search/is-search2';
import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { integrationTest } from '~/tests/test-types';
import { makeGetAllPersistentSearchStatus } from './get-all-persistent-search-status';

describe('getAllPersistentSearchStatus()', () => {
	let getAllPersistentSearchStatus: ReturnType<typeof makeGetAllPersistentSearchStatus>;
	beforeAll(async () => {
		getAllPersistentSearchStatus = makeGetAllPersistentSearchStatus(await TEST_BASE_API_CONTEXT());
	});

	it(
		'Should return all persistent searches',
		integrationTest(async () => {
			const searches = await getAllPersistentSearchStatus();
			expect(searches.every(isSearch2)).toBeTrue();
		}),
	);
});
