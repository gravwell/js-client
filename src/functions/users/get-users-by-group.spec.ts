/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { random } from 'lodash';
import { CreatableGroup, CreatableUser, isValidUser } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { NumericID } from '../../value-objects';
import { makeAddOneUserToManyGroups, makeCreateOneGroup, makeDeleteOneGroup, makeGetAllGroups } from '../groups';
import { makeCreateOneUser } from './create-one-user';
import { makeDeleteOneUser } from './delete-one-user';
import { makeGetUsersByGroup } from './get-users-by-group';

describe('getUsersByGroup()', () => {
	const getAllGroups = makeGetAllGroups({ host: TEST_HOST, useEncryption: false });
	const createOneGroup = makeCreateOneGroup({ host: TEST_HOST, useEncryption: false });
	const deleteOneGroup = makeDeleteOneGroup({ host: TEST_HOST, useEncryption: false });
	const getUsersByGroup = makeGetUsersByGroup({ host: TEST_HOST, useEncryption: false });
	const createOneUser = makeCreateOneUser({ host: TEST_HOST, useEncryption: false });
	const deleteOneUser = makeDeleteOneUser({ host: TEST_HOST, useEncryption: false });
	const addOneUserToManyGroups = makeAddOneUserToManyGroups({ host: TEST_HOST, useEncryption: false });

	let createdUserIDs: Array<NumericID>;

	beforeEach(async () => {
		// Delete all groups
		const currentGroups = await getAllGroups(TEST_AUTH_TOKEN);
		const currentGroupIDs = currentGroups.map(g => g.id);
		const deletePromises = currentGroupIDs.map(groupID => deleteOneGroup(TEST_AUTH_TOKEN, groupID));
		await Promise.all(deletePromises);

		// Create two groups
		const creatableGroups: Array<CreatableGroup> = [{ name: '1' }, { name: '2' }];
		const createPromises = creatableGroups.map(creatable => createOneGroup(TEST_AUTH_TOKEN, creatable));
		await Promise.all(createPromises);

		// Creates three users
		const createdUserIDsPs = Array.from({ length: 3 }).map(() => {
			const userSeed = random(0, Number.MAX_SAFE_INTEGER).toString();
			const data: CreatableUser = {
				name: 'Test',
				email: userSeed + '@example.com',
				password: 'changeme',
				role: 'analyst',
				user: userSeed,
			};
			return createOneUser(TEST_AUTH_TOKEN, data);
		});
		createdUserIDs = await Promise.all(createdUserIDsPs);
	});

	afterEach(async () => {
		const deleteUsersPs = createdUserIDs.map(userID => deleteOneUser(TEST_AUTH_TOKEN, userID));
		await Promise.all(deleteUsersPs);
	});

	it(
		'Should return all users of a group',
		integrationTest(async () => {
			const allGroups = await getAllGroups(TEST_AUTH_TOKEN);
			const allGroupIDs = allGroups.map(g => g.id);
			const groupID = allGroupIDs[0];
			expect(groupID).toBeDefined();
			expect(createdUserIDs.length).toBe(3);

			const addedUserIDs: Array<NumericID> = [];
			for (const userID of createdUserIDs) {
				await addOneUserToManyGroups(TEST_AUTH_TOKEN, userID, [groupID]);
				addedUserIDs.push(userID);

				const users = await getUsersByGroup(TEST_AUTH_TOKEN, groupID);
				expect(users.length).toBe(addedUserIDs.length);
				expect(users.every(isValidUser)).toBeTrue();
				expect(users.map(u => u.id).sort()).toEqual(addedUserIDs.sort());
			}
		}),
	);

	it(
		'Should return an empty array if the user belong to no groups',
		integrationTest(async () => {
			const allGroups = await getAllGroups(TEST_AUTH_TOKEN);
			const allGroupIDs = allGroups.map(g => g.id);
			const groupID = allGroupIDs[0];
			expect(groupID).toBeDefined();

			const groups = await getUsersByGroup(TEST_AUTH_TOKEN, groupID);
			expect(groups.length).toBe(0);
		}),
	);
});
