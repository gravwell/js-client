/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableGroup, isGroup } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_BASE_API_CONTEXT } from '../../tests/config';
import { makeCreateOneGroup } from './create-one-group';
import { makeDeleteOneGroup } from './delete-one-group';
import { makeGetAllGroups } from './get-all-groups';

describe('createOneGroup()', () => {
	const createOneGroup = makeCreateOneGroup(TEST_BASE_API_CONTEXT);
	const deleteOneGroup = makeDeleteOneGroup(TEST_BASE_API_CONTEXT);
	const getAllGroups = makeGetAllGroups(TEST_BASE_API_CONTEXT);

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

			const group = await createOneGroup(data);
			expect(isGroup(group)).toBeTrue();
			expect(group).toEqual(jasmine.objectContaining(data));

			const currentGroups = await getAllGroups();
			const currentGroupIDs = currentGroups.map(g => g.id);
			expect(currentGroupIDs).toContain(group.id);
		}),
	);

	it(
		'Should be able to create a group without a description',
		integrationTest(async () => {
			const data: CreatableGroup = {
				name: 'Name test',
			};

			const group = await createOneGroup(data);
			expect(isGroup(group)).toBeTrue();
			expect(group).toEqual(jasmine.objectContaining(data));

			const currentGroups = await getAllGroups();
			const currentGroupIDs = currentGroups.map(g => g.id);
			expect(currentGroupIDs).toContain(group.id);
		}),
	);
});
