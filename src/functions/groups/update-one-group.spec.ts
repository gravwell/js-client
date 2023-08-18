/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableGroup, Group, groupDecoder, UpdatableGroup } from '~/models';
import { integrationTest, integrationTestSpecDef, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneGroup } from './create-one-group';
import { makeDeleteOneGroup } from './delete-one-group';
import { makeGetAllGroups } from './get-all-groups';
import { makeGetOneGroup } from './get-one-group';
import { makeUpdateOneGroup } from './update-one-group';

describe(
	'updateOneGroup()',
	integrationTestSpecDef(() => {
		let createOneGroup: ReturnType<typeof makeCreateOneGroup>;
		beforeAll(async () => {
			createOneGroup = makeCreateOneGroup(await TEST_BASE_API_CONTEXT());
		});
		let getOneGroup: ReturnType<typeof makeGetOneGroup>;
		beforeAll(async () => {
			getOneGroup = makeGetOneGroup(await TEST_BASE_API_CONTEXT());
		});
		let deleteOneGroup: ReturnType<typeof makeDeleteOneGroup>;
		beforeAll(async () => {
			deleteOneGroup = makeDeleteOneGroup(await TEST_BASE_API_CONTEXT());
		});
		let getAllGroups: ReturnType<typeof makeGetAllGroups>;
		beforeAll(async () => {
			getAllGroups = makeGetAllGroups(await TEST_BASE_API_CONTEXT());
		});
		let updateOneGroup: ReturnType<typeof makeUpdateOneGroup>;
		beforeAll(async () => {
			updateOneGroup = makeUpdateOneGroup(await TEST_BASE_API_CONTEXT());
		});

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
			createdGroup = await createOneGroup(data);
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
					expect(groupDecoder.guard(group)).toBeTrue();
					expect(group).toEqual(jasmine.objectContaining(data));
				}
			}),
		);
	}),
);
