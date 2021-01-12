/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableGroup, CreatableUser, User } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { NumericID } from '../../value-objects';
import { makeCreateOneUser, makeDeleteOneUser, makeGetOneUser } from '../users';
import { makeAddOneUserToManyGroups } from './add-one-user-to-many-groups';
import { makeCreateOneGroup } from './create-one-group';
import { makeDeleteOneGroup } from './delete-one-group';
import { makeGetAllGroups } from './get-all-groups';
import { makeRemoveOneUserFromOneGroup } from './remove-one-user-from-one-group';

describe('removeOneUserFromOneGroup()', () => {
	const getAllGroups = makeGetAllGroups({ host: TEST_HOST, useEncryption: false });
	const createOneGroup = makeCreateOneGroup({ host: TEST_HOST, useEncryption: false });
	const deleteOneGroup = makeDeleteOneGroup({ host: TEST_HOST, useEncryption: false });
	const getOneUser = makeGetOneUser({ host: TEST_HOST, useEncryption: false });
	const createOneUser = makeCreateOneUser({ host: TEST_HOST, useEncryption: false });
	const deleteOneUser = makeDeleteOneUser({ host: TEST_HOST, useEncryption: false });
	const addOneUserToManyGroups = makeAddOneUserToManyGroups({ host: TEST_HOST, useEncryption: false });
	const removeOneUserFromOneGroup = makeRemoveOneUserFromOneGroup({ host: TEST_HOST, useEncryption: false });

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
		const createdGroupIDs = await Promise.all(createPromises);

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

		// Adds the user to all groups
		await addOneUserToManyGroups(TEST_AUTH_TOKEN, userID, createdGroupIDs);

		// Saves the user into a variable
		user = await getOneUser(TEST_AUTH_TOKEN, userID);
	});

	afterEach(async () => {
		await deleteOneUser(TEST_AUTH_TOKEN, user.id);
	});

	it(
		'Should remove the user from the group',
		integrationTest(async () => {
			expect(user.groupIDs.length).toBe(3);

			const removedGroupIDs: Array<NumericID> = [];
			for (const groupID of user.groupIDs) {
				await removeOneUserFromOneGroup(TEST_AUTH_TOKEN, user.id, groupID);
				removedGroupIDs.push(groupID);

				const _user = await getOneUser(TEST_AUTH_TOKEN, user.id);
				expect(_user.groupIDs.length).toBe(user.groupIDs.length - removedGroupIDs.length);
				expect(_user.groupIDs).not.toContain(groupID);
			}
		}),
	);
});
