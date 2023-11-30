/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableGroup } from '~/models/group/creatable-group';
import { integrationTest, integrationTestSpecDef, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneGroup } from './create-one-group';
import { makeDeleteAllGroups } from './delete-all-groups';
import { makeDeleteOneGroup } from './delete-one-group';
import { makeGetAllGroups } from './get-all-groups';

describe(
	'deleteAllGroups()',
	integrationTestSpecDef(() => {
		let deleteAllGroups: ReturnType<typeof makeDeleteAllGroups>;
		beforeAll(async () => {
			deleteAllGroups = makeDeleteAllGroups(await TEST_BASE_API_CONTEXT());
		});
		let getAllGroups: ReturnType<typeof makeGetAllGroups>;
		beforeAll(async () => {
			getAllGroups = makeGetAllGroups(await TEST_BASE_API_CONTEXT());
		});
		let deleteOneGroup: ReturnType<typeof makeDeleteOneGroup>;
		beforeAll(async () => {
			deleteOneGroup = makeDeleteOneGroup(await TEST_BASE_API_CONTEXT());
		});
		let createOneGroup: ReturnType<typeof makeCreateOneGroup>;
		beforeAll(async () => {
			createOneGroup = makeCreateOneGroup(await TEST_BASE_API_CONTEXT());
		});

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
	}),
);
