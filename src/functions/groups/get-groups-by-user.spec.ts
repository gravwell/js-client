/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableGroup, isGroup, User } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { NumericID } from '../../value-objects';
import { CreatableUser, makeCreateOneUser, makeDeleteOneUser, makeGetOneUser } from '../users';
import { makeAddOneUserToManyGroups } from './add-one-user-to-many-groups';
import { makeCreateOneGroup } from './create-one-group';
import { makeDeleteOneGroup } from './delete-one-group';
import { makeGetAllGroups } from './get-all-groups';
import { makeGetGroupsByUser } from './get-groups-by-user';

describe('getGroupsByUser()', () => {
	const getAllGroups = makeGetAllGroups({ host: TEST_HOST, useEncryption: false });
	const createOneGroup = makeCreateOneGroup({ host: TEST_HOST, useEncryption: false });
	const deleteOneGroup = makeDeleteOneGroup({ host: TEST_HOST, useEncryption: false });
	const getGroupsByUser = makeGetGroupsByUser({ host: TEST_HOST, useEncryption: false });
	const getOneUser = makeGetOneUser({ host: TEST_HOST, useEncryption: false });
	const createOneUser = makeCreateOneUser({ host: TEST_HOST, useEncryption: false });
	const deleteOneUser = makeDeleteOneUser({ host: TEST_HOST, useEncryption: false });
	const addOneUserToManyGroups = makeAddOneUserToManyGroups({ host: TEST_HOST, useEncryption: false });

	let user: User;

	beforeEach(async () => {
		// Delete all groups
		const currentGroups = await getAllGroups(TEST_AUTH_TOKEN);
		const currentGroupIDs = currentGroups.map(g => g.id);
		const deletePromises = currentGroupIDs.map(groupID => deleteOneGroup(TEST_AUTH_TOKEN, groupID));
		await Promise.all(deletePromises);

		// Create three groups
		const creatableGroups: Array<CreatableGroup> = [{ name: '1' }, { name: '2' }, { name: '3' }];
		const createPromises = creatableGroups.map(creatable => createOneGroup(TEST_AUTH_TOKEN, creatable));
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
		const userID = await createOneUser(TEST_AUTH_TOKEN, data);
		user = await getOneUser(TEST_AUTH_TOKEN, userID);
	});

	afterEach(async () => {
		await deleteOneUser(TEST_AUTH_TOKEN, user.id);
	});

	it(
		'Should return all groups of a user',
		integrationTest(async () => {
			const allGroups = await getAllGroups(TEST_AUTH_TOKEN);
			const allGroupIDs = allGroups.map(g => g.id);
			expect(allGroupIDs.length).toBe(3);
			expect(user.groupIDs.length).toBe(0);

			const addedGroupIDs: Array<NumericID> = [];
			for (const groupID of allGroupIDs) {
				await addOneUserToManyGroups(TEST_AUTH_TOKEN, user.id, [groupID]);
				addedGroupIDs.push(groupID);

				const groups = await getGroupsByUser(TEST_AUTH_TOKEN, user.id);
				expect(groups.length).toBe(addedGroupIDs.length);
				expect(groups.every(isGroup)).toBeTrue();
				expect(groups.map(g => g.id).sort()).toEqual(addedGroupIDs.sort());

				// const _user = await getOneUser(TEST_AUTH_TOKEN, user.id);
				// expect(_user.groupIDs.length).toBe(addedGroupIDs.length);
				// expect(_user.groupIDs).toContain(groupID);
				// expect(_user.groupIDs.sort()).toEqual(addedGroupIDs.sort());
			}
		}),
	);

	it(
		'Should return an empty array if the user belong to no groups',
		integrationTest(async () => {
			const groups = await getGroupsByUser(TEST_AUTH_TOKEN, user.id);
			expect(groups.length).toBe(0);
		}),
	);
});
