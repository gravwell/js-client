/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isSearch2 } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_BASE_API_CONTEXT } from '../../tests/config';
import { makeBackgroundOneSearch } from './background-one-search';
import { makeGetOnePersistentSearchStatus } from './get-one-persistent-search-status';
import { makeGetPersistentSearchStatusRelatedToMe } from './get-persistent-search-status-related-to-me';

describe('backgroundOneSearch()', () => {
	const getPersistentSearchStatusRelatedToMe = makeGetPersistentSearchStatusRelatedToMe(TEST_BASE_API_CONTEXT);
	const backgroundOneSearch = makeBackgroundOneSearch(TEST_BASE_API_CONTEXT);
	const getOnePersistentSearchStatus = makeGetOnePersistentSearchStatus(TEST_BASE_API_CONTEXT);

	xit(
		'Should background a search',
		integrationTest(async () => {
			// TODO: Create the search first

			const searches = await getPersistentSearchStatusRelatedToMe();
			expect(searches.length).toBeGreaterThanOrEqual(1);

			expect(searches[0].states).not.toContain('backgrounded');
			const searchID = searches[0].id;

			await backgroundOneSearch(searchID);
			const backgroundedSearch = await getOnePersistentSearchStatus(searchID);
			expect(isSearch2(backgroundedSearch)).toBeTrue();
			expect(backgroundedSearch.states).toContain('backgrounded');
		}),
	);
});
