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
	const getAllResources = makeGetAllResources({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });

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
