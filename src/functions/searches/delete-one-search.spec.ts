/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeDeleteOneSearch } from './delete-one-search';
import { makeGetOnePersistentSearchStatus } from './get-one-persistent-search-status';
import { makeGetPersistentSearchStatusRelatedToMe } from './get-persistent-search-status-related-to-me';

describe('deleteOneSearch()', () => {
	const getPersistentSearchStatusRelatedToMe = makeGetPersistentSearchStatusRelatedToMe(TEST_BASE_API_CONTEXT);
	const getOnePersistentSearchStatus = makeGetOnePersistentSearchStatus(TEST_BASE_API_CONTEXT);
	const deleteOneSearch = makeDeleteOneSearch(TEST_BASE_API_CONTEXT);

	xit(
		'Should delete a search',
		integrationTest(async () => {
			// TODO: Create the search first

			const searches = await getPersistentSearchStatusRelatedToMe();
			expect(searches.length).toBeGreaterThanOrEqual(1);

			expect(searches[0].states).not.toContain('saved');
			const searchID = searches[0].id;

			await deleteOneSearch(searchID);
			await new Promise(res => setTimeout(res, 1500));
			await expectAsync(getOnePersistentSearchStatus(searchID)).toBeRejected();
		}),
	);
});
