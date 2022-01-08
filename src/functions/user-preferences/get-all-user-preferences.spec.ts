/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isString } from 'lodash';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeUpdateOneUserPreferences } from '..';
import { makeDeleteOneUser, makeGetAllUsers, makeGetMyUser } from '../users';
import { makeGetAllUserPreferences } from './get-all-user-preferences';

describe('getAllUserPreferences()', () => {
	const getAllUserPreferences = makeGetAllUserPreferences(TEST_BASE_API_CONTEXT);
	const deleteOneUser = makeDeleteOneUser(TEST_BASE_API_CONTEXT);
	const getAllUsers = makeGetAllUsers(TEST_BASE_API_CONTEXT);
	const getMyUser = makeGetMyUser(TEST_BASE_API_CONTEXT);
	const updateOneUserPreferences = makeUpdateOneUserPreferences(TEST_BASE_API_CONTEXT);

	beforeEach(async () => {
		// Delete all users, except the admin
		const currentUsers = await getAllUsers();
		const myUser = await getMyUser();
		const currentUserIDs = currentUsers.map(u => u.id).filter(userID => userID !== myUser.id);
		const deletePromises = currentUserIDs.map(userID => deleteOneUser(userID));
		await Promise.all(deletePromises);

		// Reset the preferences of the current user
		await updateOneUserPreferences(myUser.id, {});
	});

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
				expect(userPreferences.preferences).toEqual({});
			});
		}),
	);
});
