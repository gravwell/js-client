/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableGroup } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneGroup } from './create-one-group';
import { makeDeleteAllGroups } from './delete-all-groups';
import { makeDeleteOneGroup } from './delete-one-group';
import { makeGetAllGroups } from './get-all-groups';

describe('deleteAllGroups()', () => {
	const deleteAllGroups = makeDeleteAllGroups(TEST_BASE_API_CONTEXT);
	const getAllGroups = makeGetAllGroups(TEST_BASE_API_CONTEXT);
	const deleteOneGroup = makeDeleteOneGroup(TEST_BASE_API_CONTEXT);
	const createOneGroup = makeCreateOneGroup(TEST_BASE_API_CONTEXT);

	beforeEach(async () => {
		// Delete all groups using single calls
		const currentGroups = await getAllGroups();
		const currentGroupIDs = currentGroups.map(g => g.id);
		const deletePromises = currentGroupIDs.map(groupID => deleteOneGroup(groupID));
		await Promise.all(deletePromises);

		// Create two groups using single call
		const creatableGroups: Array<CreatableGroup> = [{ name: 'N1', description: 'D1' }, { name: 'N2' }];
		const createPromises = creatableGroups.map(creatable => createOneGroup(creatable));
		await Promise.all(createPromises);
	});

	it(
		'Should delete all groups',
		integrationTest(async () => {
			const currentGroups = await getAllGroups();
			const currentGroupIDs = currentGroups.map(g => g.id);
			expect(currentGroupIDs.length).toBe(2);

			await deleteAllGroups();

			const remainingGroups = await getAllGroups();
			const remainingGroupIDs = remainingGroups.map(g => g.id);
			expect(remainingGroupIDs.length).toBe(0);
		}),
	);
});
