/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableGroup, isGroup } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeCreateOneGroup } from './create-one-group';
import { makeDeleteOneGroup } from './delete-one-group';
import { makeGetAllGroups } from './get-all-groups';
import { makeGetOneGroup } from './get-one-group';

describe('createOneGroup()', () => {
	const createOneGroup = makeCreateOneGroup({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const getOneGroup = makeGetOneGroup({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const deleteOneGroup = makeDeleteOneGroup({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const getAllGroups = makeGetAllGroups({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });

	beforeEach(async () => {
		// Delete all groups
		const currentGroups = await getAllGroups();
		const currentGroupIDs = currentGroups.map(g => g.id);
		const deletePromises = currentGroupIDs.map(groupID => deleteOneGroup(groupID));
		await Promise.all(deletePromises);
	});

	it(
		"Should create a group and return it's id",
		integrationTest(async () => {
			const data: CreatableGroup = {
				name: 'Name test',
				description: 'Description test',
			};

			const groupID = await createOneGroup(data);
			const group = await getOneGroup(groupID);
			expect(isGroup(group)).toBeTrue();
			expect(group).toEqual(jasmine.objectContaining(data));

			const currentGroups = await getAllGroups();
			const currentGroupIDs = currentGroups.map(g => g.id);
			expect(currentGroupIDs).toContain(groupID);
		}),
	);

	it(
		'Should be able to create a group without a description',
		integrationTest(async () => {
			const data: CreatableGroup = {
				name: 'Name test',
			};

			const groupID = await createOneGroup(data);
			const group = await getOneGroup(groupID);
			expect(isGroup(group)).toBeTrue();
			expect(group).toEqual(jasmine.objectContaining(data));

			const currentGroups = await getAllGroups();
			const currentGroupIDs = currentGroups.map(g => g.id);
			expect(currentGroupIDs).toContain(groupID);
		}),
	);
});
