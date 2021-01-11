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

describe('getAllGroups()', () => {
	const getAllGroups = makeGetAllGroups({ host: TEST_HOST, useEncryption: false });
	const createOneGroup = makeCreateOneGroup({ host: TEST_HOST, useEncryption: false });
	const deleteOneGroup = makeDeleteOneGroup({ host: TEST_HOST, useEncryption: false });

	beforeEach(async () => {
		// Delete all groups
		const currentGroups = await getAllGroups(TEST_AUTH_TOKEN);
		const currentGroupIDs = currentGroups.map(g => g.id);
		const deletePromises = currentGroupIDs.map(groupID => deleteOneGroup(TEST_AUTH_TOKEN, groupID));
		await Promise.all(deletePromises);
	});

	it(
		'Should return all groups',
		integrationTest(async () => {
			// Create two groups
			const creatableGroups: Array<CreatableGroup> = [{ name: 'N1', description: 'D1' }, { name: 'N2' }];
			const createPromises = creatableGroups.map(creatable => createOneGroup(TEST_AUTH_TOKEN, creatable));
			await Promise.all(createPromises);

			const groups = await getAllGroups(TEST_AUTH_TOKEN);
			expect(groups.length).toBe(2);
			expect(groups.every(isGroup)).toBeTrue();
		}),
	);

	it(
		'Should return an empty array if there are no groups',
		integrationTest(async () => {
			const groups = await getAllGroups(TEST_AUTH_TOKEN);
			expect(groups.length).toBe(0);
		}),
	);
});
