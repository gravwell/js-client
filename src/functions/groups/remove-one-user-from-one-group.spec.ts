/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableGroup, CreatableUser, User } from '~/models';
import { integrationTest, integrationTestSpecDef, TEST_BASE_API_CONTEXT } from '~/tests';
import { NumericID } from '~/value-objects';
import { makeCreateOneUser, makeDeleteOneUser, makeGetOneUser } from '../users';
import { makeAddOneUserToManyGroups } from './add-one-user-to-many-groups';
import { makeCreateOneGroup } from './create-one-group';
import { makeDeleteOneGroup } from './delete-one-group';
import { makeGetAllGroups } from './get-all-groups';
import { makeRemoveOneUserFromOneGroup } from './remove-one-user-from-one-group';

describe(
	'removeOneUserFromOneGroup()',
	integrationTestSpecDef(() => {
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
		let getOneUser: ReturnType<typeof makeGetOneUser>;
		beforeAll(async () => {
			getOneUser = makeGetOneUser(await TEST_BASE_API_CONTEXT());
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
		let removeOneUserFromOneGroup: ReturnType<typeof makeRemoveOneUserFromOneGroup>;
		beforeAll(async () => {
			removeOneUserFromOneGroup = makeRemoveOneUserFromOneGroup(await TEST_BASE_API_CONTEXT());
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
			const createdGroups = await Promise.all(createPromises);
			const createdGroupIDs = createdGroups.map(g => g.id);

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

			// Adds the user to all groups
			await addOneUserToManyGroups(user.id, createdGroupIDs);
		});

		afterEach(async () => {
			await deleteOneUser(user.id);
		});

		xit(
			'Should remove the user from the group',
			integrationTest(async () => {
				expect(user.groupIDs.length).toBe(3);

				const removedGroupIDs: Array<NumericID> = [];
				for (const groupID of user.groupIDs) {
					await removeOneUserFromOneGroup(user.id, groupID);
					removedGroupIDs.push(groupID);

					const _user = await getOneUser(user.id);
					expect(_user.groupIDs.length).toBe(user.groupIDs.length - removedGroupIDs.length);
					expect(_user.groupIDs).not.toContain(groupID);
				}
			}),
		);
	}),
);
