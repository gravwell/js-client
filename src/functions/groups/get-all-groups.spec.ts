/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableGroup } from '~/models/group/creatable-group';
import { groupDecoder } from '~/models/group/is-group';
import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { integrationTest, integrationTestSpecDef } from '~/tests/test-types';
import { makeCreateOneGroup } from './create-one-group';
import { makeDeleteOneGroup } from './delete-one-group';
import { makeGetAllGroups } from './get-all-groups';

describe(
	'getAllGroups()',
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
				expect(groups.every(group => groupDecoder.guard(group))).toBeTrue();
			}),
		);

		it(
			'Should return an empty array if there are no groups',
			integrationTest(async () => {
				const groups = await getAllGroups();
				expect(groups.length).toBe(0);
			}),
		);
	}),
);
