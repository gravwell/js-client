/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableGroup, CreatableUser, isGroup, User } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { NumericID } from '~/value-objects';
import { makeCreateOneUser, makeDeleteOneUser } from '../users';
import { makeAddOneUserToManyGroups } from './add-one-user-to-many-groups';
import { makeCreateOneGroup } from './create-one-group';
import { makeDeleteOneGroup } from './delete-one-group';
import { makeGetAllGroups } from './get-all-groups';
import { makeGetGroupsByUser } from './get-groups-by-user';

describe('getGroupsByUser()', () => {
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
	let getGroupsByUser: ReturnType<typeof makeGetGroupsByUser>;
	beforeAll(async () => {
		getGroupsByUser = makeGetGroupsByUser(await TEST_BASE_API_CONTEXT());
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

	let user: User;

	beforeEach(async () => {
		// Delete all groups
		const currentGroups = await getAllGroups();
		const currentGroupIDs = currentGroups.map(g => g.id);
		const deletePromises = currentGroupIDs.map(groupID => deleteOneGroup(groupID));
		await Promise.all(deletePromises);

		// Create three groups
		const creatableGroups: Array<CreatableGroup> = [{ name: '1' }, { name: '2' }, { name: '3' }];
		const createPromises = creatableGroups.map(creatable => createOneGroup(creatable));
		await Promise.all(createPromises);

		// Creates a user
		const userSeed = 'whatever4324234';
		const data: CreatableUser = {
			name: 'Test',
			email: userSeed + '@example.com',
			password: 'changeme',
			role: 'analyst',
			user: userSeed,
		};
		user = await createOneUser(data);
	});

	afterEach(async () => {
		await deleteOneUser(user.id);
	});

	xit(
		'Should return all groups of a user',
		integrationTest(async () => {
			const allGroups = await getAllGroups();
			const allGroupIDs = allGroups.map(g => g.id);
			expect(allGroupIDs.length).toBe(3);
			expect(user.groupIDs.length).toBe(0);

			const addedGroupIDs: Array<NumericID> = [];
			for (const groupID of allGroupIDs) {
				await addOneUserToManyGroups(user.id, [groupID]);
				addedGroupIDs.push(groupID);

				const groups = await getGroupsByUser(user.id);
				expect(groups.length).toBe(addedGroupIDs.length);
				expect(groups.every(isGroup)).toBeTrue();
				expect(groups.map(g => g.id).sort()).toEqual(addedGroupIDs.sort());

				// const _user = await getOneUser( user.id);
				// expect(_user.groupIDs.length).toBe(addedGroupIDs.length);
				// expect(_user.groupIDs).toContain(groupID);
				// expect(_user.groupIDs.sort()).toEqual(addedGroupIDs.sort());
			}
		}),
	);

	xit(
		'Should return an empty array if the user belong to no groups',
		integrationTest(async () => {
			const groups = await getGroupsByUser(user.id);
			expect(groups.length).toBe(0);
		}),
	);
});
