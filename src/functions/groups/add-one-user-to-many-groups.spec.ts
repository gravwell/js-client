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

describe('addOneUserToManyGroups()', () => {
	const getAllGroups = makeGetAllGroups({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const createOneGroup = makeCreateOneGroup({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const deleteOneGroup = makeDeleteOneGroup({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const getOneUser = makeGetOneUser({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const createOneUser = makeCreateOneUser({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const deleteOneUser = makeDeleteOneUser({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const addOneUserToManyGroups = makeAddOneUserToManyGroups({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
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
		const userID = await createOneUser(data);
		user = await getOneUser(userID);
	});

	afterEach(async () => {
		await deleteOneUser(user.id);
	});

	it(
		'Should add the user to the groups',
		integrationTest(async () => {
			const allGroups = await getAllGroups();
			const allGroupIDs = allGroups.map(g => g.id);
			expect(allGroupIDs.length).toBe(3);
			expect(user.groupIDs.length).toBe(0);

			const tests: Array<Array<NumericID>> = [[allGroupIDs[0]], [allGroupIDs[1], allGroupIDs[2]]];

			const addedGroupIDs: Array<NumericID> = [];
			for (const groupIDs of tests) {
				await addOneUserToManyGroups(user.id, groupIDs);
				addedGroupIDs.push(...groupIDs);

				const _user = await getOneUser(user.id);
				expect(_user.groupIDs.length).toBe(addedGroupIDs.length);
				for (const groupID of groupIDs) expect(_user.groupIDs).toContain(groupID);
				expect(_user.groupIDs.sort()).toEqual(addedGroupIDs.sort());
			}
		}),
	);
});
