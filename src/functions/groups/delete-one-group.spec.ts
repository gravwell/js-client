/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableGroup } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeCreateOneGroup } from './create-one-group';
import { makeDeleteOneGroup } from './delete-one-group';
import { makeGetAllGroups } from './get-all-groups';
import { makeGetOneGroup } from './get-one-group';

describe('deleteOneGroup()', () => {
	const createOneGroup = makeCreateOneGroup({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const deleteOneGroup = makeDeleteOneGroup({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const getAllGroups = makeGetAllGroups({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const getOneGroup = makeGetOneGroup({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });

	beforeEach(async () => {
		// Delete all groups
		const currentGroups = await getAllGroups();
		const currentGroupIDs = currentGroups.map(g => g.id);
		const deletePromises = currentGroupIDs.map(groupID => deleteOneGroup(groupID));
		await Promise.all(deletePromises);

		// Create two groups
		const creatableGroups: Array<CreatableGroup> = [{ name: 'N1', description: 'D1' }, { name: 'N2' }];
		const createPromises = creatableGroups.map(creatable => createOneGroup(creatable));
		await Promise.all(createPromises);
	});

	it(
		'Should delete a group',
		integrationTest(async () => {
			const currentGroups = await getAllGroups();
			const currentGroupIDs = currentGroups.map(g => g.id);
			expect(currentGroupIDs.length).toBe(2);

			const deleteGroupID = currentGroupIDs[0];
			await deleteOneGroup(deleteGroupID);
			await expectAsync(getOneGroup(deleteGroupID)).toBeRejected();

			const remainingGroups = await getAllGroups();
			const remainingGroupIDs = remainingGroups.map(g => g.id);
			expect(remainingGroupIDs).not.toContain(deleteGroupID);
			expect(remainingGroupIDs.length).toBe(1);
		}),
	);
});
