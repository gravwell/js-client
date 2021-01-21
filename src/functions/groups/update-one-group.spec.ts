/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableGroup, Group, isGroup, UpdatableGroup } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeCreateOneGroup } from './create-one-group';
import { makeDeleteOneGroup } from './delete-one-group';
import { makeGetAllGroups } from './get-all-groups';
import { makeGetOneGroup } from './get-one-group';
import { makeUpdateOneGroup } from './update-one-group';

describe('updateOneGroup()', () => {
	const createOneGroup = makeCreateOneGroup({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const getOneGroup = makeGetOneGroup({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const deleteOneGroup = makeDeleteOneGroup({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const getAllGroups = makeGetAllGroups({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const updateOneGroup = makeUpdateOneGroup({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });

	let createdGroup: Group;

	beforeEach(async () => {
		// Delete all groups
		const currentGroups = await getAllGroups();
		const currentGroupIDs = currentGroups.map(g => g.id);
		const deletePromises = currentGroupIDs.map(groupID => deleteOneGroup(groupID));
		await Promise.all(deletePromises);

		// Creates a group
		const data: CreatableGroup = {
			name: 'Name test',
			description: 'Description test',
		};
		const groupID = await createOneGroup(data);
		createdGroup = await getOneGroup(groupID);
	});

	afterEach(async () => {
		// Deletes the created group
		await deleteOneGroup(createdGroup.id);
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
				await updateOneGroup(data);
				const group = await getOneGroup(data.id);
				expect(isGroup(group)).toBeTrue();
				expect(group).toEqual(jasmine.objectContaining(data));
			}
		}),
	);
});
