/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableUser, User } from '~/models';
import { CreatableGroup } from '~/models/group/creatable-group';
import { integrationTest, integrationTestSpecDef, TEST_BASE_API_CONTEXT } from '~/tests';
import { NumericID } from '~/value-objects';
import { makeCreateOneUser } from '../users/create-one-user';
import { makeDeleteOneUser } from '../users/delete-one-user';
import { makeGetOneUser } from '../users/get-one-user';
import { assertNoneNil } from '../utils/type-guards';
import { makeAddOneUserToManyGroups } from './add-one-user-to-many-groups';
import { makeCreateOneGroup } from './create-one-group';
import { makeDeleteOneGroup } from './delete-one-group';
import { makeGetAllGroups } from './get-all-groups';

describe(
	'addOneUserToManyGroups()',
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
				username: userSeed,
			};
			user = await createOneUser(data);
		});

		afterEach(async () => {
			await deleteOneUser(user.id);
		});

		xit(
			'Should add the user to the groups',
			integrationTest(async () => {
				const allGroups = await getAllGroups();
				const allGroupIDs = allGroups.map(g => g.id);
				expect(allGroupIDs.length).toBe(3);
				expect(user.groupIDs.length).toBe(0);

				const part1 = [allGroupIDs[0]];
				const part2 = [allGroupIDs[1], allGroupIDs[2]];
				assertNoneNil(part1);
				assertNoneNil(part2);

				const tests: Array<Array<NumericID>> = [part1, part2];

				const addedGroupIDs: Array<NumericID> = [];
				for (const groupIDs of tests) {
					await addOneUserToManyGroups(user.id, groupIDs);
					addedGroupIDs.push(...groupIDs);

					const _user = await getOneUser(user.id);
					expect(_user.groupIDs.length).toBe(addedGroupIDs.length);
					for (const groupID of groupIDs) {
						expect(_user.groupIDs).toContain(groupID);
					}
					expect(_user.groupIDs.sort()).toEqual(addedGroupIDs.sort());
				}
			}),
		);
	}),
);
