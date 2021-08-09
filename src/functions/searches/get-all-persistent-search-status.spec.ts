/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isSearch2 } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeGetAllPersistentSearchStatus } from './get-all-persistent-search-status';

describe('getAllPersistentSearchStatus()', () => {
	const getAllPersistentSearchStatus = makeGetAllPersistentSearchStatus(TEST_BASE_API_CONTEXT);

	it(
		'Should return all persistent searches',
		integrationTest(async () => {
			const searches = await getAllPersistentSearchStatus();
			expect(searches.every(isSearch2)).toBeTrue();
		}),
	);
});
