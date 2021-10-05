/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeGetAllUserPreferences } from './get-all-user-preferences';

fdescribe('getAllUserPreferences()', () => {
	const getAllUserPreferences = makeGetAllUserPreferences(TEST_BASE_API_CONTEXT);

	it(
		'Should return all user preferences',
		integrationTest(async () => {
			const userPreferencesList = await getAllUserPreferences();
			for (let i = 0; i < userPreferencesList.length; i++) {
				const userPreferences = userPreferencesList[i];
				expect(Object.keys(userPreferences)).toEqual(['userID', 'lastUpdateDate', 'preferences']);
			}
		}),
	);
});
