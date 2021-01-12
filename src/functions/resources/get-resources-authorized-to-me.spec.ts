/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableResource, isResource } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { UUID } from '../../value-objects';
import { makeCreateOneResource } from './create-one-resource';
import { makeDeleteOneResource } from './delete-one-resource';
import { makeGetResourcesAuthorizedToMe } from './get-resources-authorized-to-me';

describe('getResourcesAuthorizedToMe()', () => {
	const getResourcesAuthorizedToMe = makeGetResourcesAuthorizedToMe({ host: TEST_HOST, useEncryption: false });
	const createOneResource = makeCreateOneResource({ host: TEST_HOST, useEncryption: false });
	const deleteOneResource = makeDeleteOneResource({ host: TEST_HOST, useEncryption: false });

	let createdResourcesIDs: Array<UUID> = [];

	beforeEach(async () => {
		// Create two resources
		const datas: Array<CreatableResource> = Array.from({ length: 2 }).map((_, i) => ({
			name: 'name' + i,
			description: 'description' + i,
		}));
		const createdResourcesPs = datas.map(data => createOneResource(TEST_AUTH_TOKEN, data));
		const createdResources = await Promise.all(createdResourcesPs);
		createdResourcesIDs = createdResources.map(r => r.id);
	});

	afterEach(async () => {
		// Delete the created resources
		const deletePs = createdResourcesIDs.map(resourceID => deleteOneResource(TEST_AUTH_TOKEN, resourceID));
		await Promise.all(deletePs);
	});

	it(
		'Should return resources',
		integrationTest(async () => {
			const resources = await getResourcesAuthorizedToMe(TEST_AUTH_TOKEN);
			const resourceIDs = resources.map(r => r.id);

			expect(resources.every(isResource)).toBeTrue();
			expect(resources.length).toBeGreaterThanOrEqual(createdResourcesIDs.length);
			for (const resourceID of createdResourcesIDs) expect(resourceIDs).toContain(resourceID);
		}),
	);
});
