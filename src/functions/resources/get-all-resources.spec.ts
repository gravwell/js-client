/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isResource } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeGetAllResources } from './get-all-resources';

describe('getAllResources()', () => {
	const getAllResources = makeGetAllResources({ host: TEST_HOST, useEncryption: false });

	beforeEach(async () => {
		// TODO: Create two resources
		// const data: CreatablePlaybook = {
		// 	name: 'Playbook test',
		// 	body: 'This is my playbook',
		// };
		// const createdPlaybooksUUIDsPs = Array.from({ length: 2 }).map(() => createOnePlaybook(TEST_AUTH_TOKEN, data));
		// createdPlaybooksUUIDs = await Promise.all(createdPlaybooksUUIDsPs);
	});

	afterEach(async () => {
		// Delete the created resources
		// const deletePs = createdPlaybooksUUIDs.map(playbookUUID => deleteOnePlaybook(TEST_AUTH_TOKEN, playbookUUID));
		// await Promise.all(deletePs);
	});

	it(
		'Should return resources',
		integrationTest(async () => {
			const resources = await getAllResources(TEST_AUTH_TOKEN);
			expect(resources.map(r => ({ ...r, body: '' })).every(isResource)).toBeTrue();
		}),
	);
});
