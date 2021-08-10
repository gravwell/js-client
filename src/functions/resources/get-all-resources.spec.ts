/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isResource } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeGetAllResources } from './get-all-resources';

describe('getAllResources()', () => {
	const getAllResources = makeGetAllResources(TEST_BASE_API_CONTEXT);

	beforeEach(async () => {
		// TODO: Create two resources
		// const data: CreatablePlaybook = {
		// 	name: 'Playbook test',
		// 	body: 'This is my playbook',
		// };
		// const createdPlaybooksUUIDsPs = Array.from({ length: 2 }).map(() => createOnePlaybook( data));
		// createdPlaybooksUUIDs = await Promise.all(createdPlaybooksUUIDsPs);
	});

	afterEach(async () => {
		// Delete the created resources
		// const deletePs = createdPlaybooksUUIDs.map(playbookUUID => deleteOnePlaybook( playbookUUID));
		// await Promise.all(deletePs);
	});

	it(
		'Should return resources',
		integrationTest(async () => {
			const resources = await getAllResources();
			expect(resources.map(r => ({ ...r, body: '' })).every(isResource)).toBeTrue();
		}),
	);
});
