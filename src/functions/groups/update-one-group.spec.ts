/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Group, isGroup } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { CreatableGroup, makeCreateOneGroup } from './create-one-group';
import { makeDeleteOneGroup } from './delete-one-group';
import { makeGetAllGroups } from './get-all-groups';
import { makeGetOneGroup } from './get-one-group';
import { makeUpdateOneGroup, UpdatableGroup } from './update-one-group';

describe('updateOneGroup()', () => {
	const createOneGroup = makeCreateOneGroup({ host: TEST_HOST, useEncryption: false });
	const getOneGroup = makeGetOneGroup({ host: TEST_HOST, useEncryption: false });
	const deleteOneGroup = makeDeleteOneGroup({ host: TEST_HOST, useEncryption: false });
	const getAllGroups = makeGetAllGroups({ host: TEST_HOST, useEncryption: false });
	const updateOneGroup = makeUpdateOneGroup({ host: TEST_HOST, useEncryption: false });

	let createdGroup: Group;

	beforeEach(async () => {
		// Delete all groups
		const currentGroups = await getAllGroups(TEST_AUTH_TOKEN);
		const currentGroupIDs = currentGroups.map(g => g.id);
		const deletePromises = currentGroupIDs.map(groupID => deleteOneGroup(TEST_AUTH_TOKEN, groupID));
		await Promise.all(deletePromises);

		// Creates a group
		const data: CreatableGroup = {
			name: 'Name test',
			description: 'Description test',
		};
		const groupID = await createOneGroup(TEST_AUTH_TOKEN, data);
		createdGroup = await getOneGroup(TEST_AUTH_TOKEN, groupID);
	});

	afterEach(async () => {
		// Deletes the created group
		await deleteOneGroup(TEST_AUTH_TOKEN, createdGroup.id);
	});

	it(
		'Should update the group',
		integrationTest(async () => {
			const tests: Array<Omit<UpdatableGroup, 'id'>> = [
				{ name: 'new name' },
				{ description: 'new description' },
				{ description: null },
				{ name: 'newwwww name', description: 'newwwww description' },
			];

			for (const test of tests) {
				const data: UpdatableGroup = { ...test, id: createdGroup.id };
				await updateOneGroup(TEST_AUTH_TOKEN, data);
				const group = await getOneGroup(TEST_AUTH_TOKEN, data.id);
				expect(isGroup(group)).toBeTrue();
				expect(group).toEqual(jasmine.objectContaining(data));
			}
		}),
	);
});
