/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeDeleteOneSearch } from './delete-one-search';
import { makeGetOnePersistentSearchStatus } from './get-one-persistent-search-status';
import { makeGetPersistentSearchStatusRelatedToMe } from './get-persistent-search-status-related-to-me';

describe('deleteOneSearch()', () => {
	const getPersistentSearchStatusRelatedToMe = makeGetPersistentSearchStatusRelatedToMe({
		host: TEST_HOST,
		useEncryption: false,
	});
	const getOnePersistentSearchStatus = makeGetOnePersistentSearchStatus({
		host: TEST_HOST,
		useEncryption: false,
	});
	const deleteOneSearch = makeDeleteOneSearch({
		host: TEST_HOST,
		useEncryption: false,
	});

	xit(
		'Should delete a search',
		integrationTest(async () => {
			// TODO: Create the search first

			const searches = await getPersistentSearchStatusRelatedToMe(TEST_AUTH_TOKEN);
			expect(searches.length).toBeGreaterThanOrEqual(1);

			expect(searches[0].states).not.toContain('saved');
			const searchID = searches[0].id;

			await deleteOneSearch(TEST_AUTH_TOKEN, searchID);
			await new Promise(res => setTimeout(res, 1500));
			await expectAsync(getOnePersistentSearchStatus(TEST_AUTH_TOKEN, searchID)).toBeRejected();
		}),
	);
});
