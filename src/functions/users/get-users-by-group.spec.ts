/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { random } from 'lodash';
import { CreatableGroup, CreatableUser, isValidUser } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { NumericID } from '~/value-objects';
import { makeAddOneUserToManyGroups, makeCreateOneGroup, makeDeleteOneGroup, makeGetAllGroups } from '../groups';
import { assertIsNotNil } from '../utils/type-guards';
import { makeCreateOneUser } from './create-one-user';
import { makeDeleteOneUser } from './delete-one-user';
import { makeGetUsersByGroup } from './get-users-by-group';

describe('getUsersByGroup()', () => {
	let getAllGroups: ReturnType<typeof makeGetAllGroups>;
	beforeAll(async () => {
		getAllGroups = makeGetAllGroups(await TEST_BASE_API_CONTEXT());
	});
	let createOneGroup: ReturnType<typeof makeCreateOneGroup>;
	beforeAll(async () => {
		createOneGroup = makeCreateOneGroup(await TEST_BASE_API_CONTEXT());
	});
	let deleteOneGroup: ReturnType<typeof makeDeleteOneGroup>;
	beforeAll(async () => {
		deleteOneGroup = makeDeleteOneGroup(await TEST_BASE_API_CONTEXT());
	});
	let getUsersByGroup: ReturnType<typeof makeGetUsersByGroup>;
	beforeAll(async () => {
		getUsersByGroup = makeGetUsersByGroup(await TEST_BASE_API_CONTEXT());
	});
	let createOneUser: ReturnType<typeof makeCreateOneUser>;
	beforeAll(async () => {
		createOneUser = makeCreateOneUser(await TEST_BASE_API_CONTEXT());
	});
	let deleteOneUser: ReturnType<typeof makeDeleteOneUser>;
	beforeAll(async () => {
		deleteOneUser = makeDeleteOneUser(await TEST_BASE_API_CONTEXT());
	});
	let addOneUserToManyGroups: ReturnType<typeof makeAddOneUserToManyGroups>;
	beforeAll(async () => {
		addOneUserToManyGroups = makeAddOneUserToManyGroups(await TEST_BASE_API_CONTEXT());
	});

	let createdUserIDs: Array<NumericID>;

	beforeEach(async () => {
		// Delete all groups
		const currentGroups = await getAllGroups();
		const currentGroupIDs = currentGroups.map(g => g.id);
		const deletePromises = currentGroupIDs.map(groupID => deleteOneGroup(groupID));
		await Promise.all(deletePromises);

		// Create two groups
		const creatableGroups: Array<CreatableGroup> = [{ name: '1' }, { name: '2' }];
		const createPromises = creatableGroups.map(creatable => createOneGroup(creatable));
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
			return createOneUser(data);
		});
		createdUserIDs = (await Promise.all(createdUserIDsPs)).map(u => u.id);
	});

	afterEach(async () => {
		const deleteUsersPs = createdUserIDs.map(userID => deleteOneUser(userID));
		await Promise.all(deleteUsersPs);
	});

	xit(
		'Should return all users of a group',
		integrationTest(async () => {
			const allGroups = await getAllGroups();
			const allGroupIDs = allGroups.map(g => g.id);
			const groupID = allGroupIDs[0];
			assertIsNotNil(groupID);
			expect(createdUserIDs.length).toBe(3);

			const addedUserIDs: Array<NumericID> = [];
			for (const userID of createdUserIDs) {
				await addOneUserToManyGroups(userID, [groupID]);
				addedUserIDs.push(userID);

				const users = await getUsersByGroup(groupID);
				expect(users.length).toBe(addedUserIDs.length);
				expect(users.every(isValidUser)).toBeTrue();
				expect(users.map(u => u.id).sort()).toEqual(addedUserIDs.sort());
			}
		}),
	);

	xit(
		'Should return an empty array if the user belong to no groups',
		integrationTest(async () => {
			const allGroups = await getAllGroups();
			const allGroupIDs = allGroups.map(g => g.id);
			const groupID = allGroupIDs[0];
			assertIsNotNil(groupID);

			const groups = await getUsersByGroup(groupID);
			expect(groups.length).toBe(0);
		}),
	);
});
