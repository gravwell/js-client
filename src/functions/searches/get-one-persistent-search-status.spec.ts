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
import { makeGetOnePersistentSearchStatus } from './get-one-persistent-search-status';
import { makeGetPersistentSearchStatusRelatedToMe } from './get-persistent-search-status-related-to-me';

describe('getOnePersistentSearchStatus()', () => {
	const getPersistentSearchStatusRelatedToMe = makeGetPersistentSearchStatusRelatedToMe({
		host: TEST_HOST,
		useEncryption: false,
	});
	const getOnePersistentSearchStatus = makeGetOnePersistentSearchStatus({
		host: TEST_HOST,
		useEncryption: false,
	});

	xit(
		'Should return a persistent search',
		integrationTest(async () => {
			// TODO: Create the search first

			const searches = await getPersistentSearchStatusRelatedToMe(TEST_AUTH_TOKEN);
			expect(searches.length).toBeGreaterThanOrEqual(1);
			const searchID = searches[0].id;

			const search = await getOnePersistentSearchStatus(TEST_AUTH_TOKEN, searchID);
			expect(isSearch2(search)).toBeTrue();
		}),
	);
});
