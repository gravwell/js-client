/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableGroup, isGroup } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneGroup } from './create-one-group';
import { makeDeleteOneGroup } from './delete-one-group';
import { makeGetAllGroups } from './get-all-groups';

describe('getAllGroups()', () => {
	const getAllGroups = makeGetAllGroups(TEST_BASE_API_CONTEXT);
	const createOneGroup = makeCreateOneGroup(TEST_BASE_API_CONTEXT);
	const deleteOneGroup = makeDeleteOneGroup(TEST_BASE_API_CONTEXT);

	beforeEach(async () => {
		// Delete all groups
		const currentGroups = await getAllGroups();
		const currentGroupIDs = currentGroups.map(g => g.id);
		const deletePromises = currentGroupIDs.map(groupID => deleteOneGroup(groupID));
		await Promise.all(deletePromises);
	});

	it(
		'Should return all groups',
		integrationTest(async () => {
			// Create two groups
			const creatableGroups: Array<CreatableGroup> = [{ name: 'N1', description: 'D1' }, { name: 'N2' }];
			const createPromises = creatableGroups.map(creatable => createOneGroup(creatable));
			await Promise.all(createPromises);

			const groups = await getAllGroups();
			expect(groups.length).toBe(2);
			expect(groups.every(isGroup)).toBeTrue();
		}),
	);

	it(
		'Should return an empty array if there are no groups',
		integrationTest(async () => {
			const groups = await getAllGroups();
			expect(groups.length).toBe(0);
		}),
	);
});
