/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isObject, isString } from 'lodash';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeGetAllUserPreferences } from './get-all-user-preferences';

describe('getAllUserPreferences()', () => {
	const getAllUserPreferences = makeGetAllUserPreferences(TEST_BASE_API_CONTEXT);

	it(
		'should return an array of user preferences with metadata',
		integrationTest(async () => {
			// There should only be one user in the system, so only 1 preference
			const userPreferencesList = await getAllUserPreferences();
			expect(userPreferencesList).toHaveSize(1);

			// Expect returned array elements to have the following properties: .userID, .lastUpdateDate and .preferences
			Array.from(userPreferencesList).forEach(userPreferences => {
				expect(Object.keys(userPreferences)).toEqual(['userID', 'lastUpdateDate', 'preferences']);
				expect(isString(userPreferences.userID)).toBeTrue();
				expect(userPreferences.lastUpdateDate).toBeInstanceOf(Date);
				expect(isObject(userPreferences.preferences)).toBeTrue();
			});
		}),
	);
});
