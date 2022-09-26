/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isSearch2 } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { assertIsNotNil } from '../utils/type-guards';
import { makeGetOnePersistentSearchStatus } from './get-one-persistent-search-status';
import { makeGetPersistentSearchStatusRelatedToMe } from './get-persistent-search-status-related-to-me';

describe('getOnePersistentSearchStatus()', () => {
	let getPersistentSearchStatusRelatedToMe: ReturnType<typeof makeGetPersistentSearchStatusRelatedToMe>;
	beforeAll(async () => {
		getPersistentSearchStatusRelatedToMe = makeGetPersistentSearchStatusRelatedToMe(await TEST_BASE_API_CONTEXT());
	});
	let getOnePersistentSearchStatus: ReturnType<typeof makeGetOnePersistentSearchStatus>;
	beforeAll(async () => {
		getOnePersistentSearchStatus = makeGetOnePersistentSearchStatus(await TEST_BASE_API_CONTEXT());
	});

	xit(
		'Should return a persistent search',
		integrationTest(async () => {
			// TODO: Create the search first

			const searches = await getPersistentSearchStatusRelatedToMe();
			expect(searches.length).toBeGreaterThanOrEqual(1);
			const fst = searches[0];
			assertIsNotNil(fst);
			const searchID = fst.id;

			const search = await getOnePersistentSearchStatus(searchID);
			expect(isSearch2(search)).toBeTrue();
		}),
	);
});
