/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isSearch2 } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeGetAllPersistentSearchStatus } from './get-all-persistent-search-status';

describe('getAllPersistentSearchStatus()', () => {
	const getAllPersistentSearchStatus = makeGetAllPersistentSearchStatus({
		host: TEST_HOST,
		useEncryption: false,
	});

	it(
		'Should return all persistent searches',
		integrationTest(async () => {
			const searches = await getAllPersistentSearchStatus(TEST_AUTH_TOKEN);
			expect(searches.every(isSearch2)).toBeTrue();
		}),
	);
});
