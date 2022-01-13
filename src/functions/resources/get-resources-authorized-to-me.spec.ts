/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableResource, isResource } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { UUID } from '~/value-objects';
import { makeCreateOneResource } from './create-one-resource';
import { makeDeleteOneResource } from './delete-one-resource';
import { makeGetResourcesAuthorizedToMe } from './get-resources-authorized-to-me';

describe('getResourcesAuthorizedToMe()', () => {
	const getResourcesAuthorizedToMe = makeGetResourcesAuthorizedToMe(TEST_BASE_API_CONTEXT);
	const createOneResource = makeCreateOneResource(TEST_BASE_API_CONTEXT);
	const deleteOneResource = makeDeleteOneResource(TEST_BASE_API_CONTEXT);

	let createdResourcesIDs: Array<UUID> = [];

	beforeEach(async () => {
		// Create two resources
		const datas: Array<CreatableResource> = Array.from({ length: 2 }).map((_, i) => ({
			name: 'name' + i,
			description: 'description' + i,
		}));
		const createdResourcesPs = datas.map(data => createOneResource(data));
		const createdResources = await Promise.all(createdResourcesPs);
		createdResourcesIDs = createdResources.map(r => r.id);
	});

	afterEach(async () => {
		// Delete the created resources
		const deletePs = createdResourcesIDs.map(resourceID => deleteOneResource(resourceID));
		await Promise.all(deletePs);
	});

	it(
		'Should return resources',
		integrationTest(async () => {
			const resources = await getResourcesAuthorizedToMe();
			const resourceIDs = resources.map(r => r.id);

			expect(resources.every(isResource)).toBeTrue();
			expect(resources.length).toBeGreaterThanOrEqual(createdResourcesIDs.length);
			for (const resourceID of createdResourcesIDs) expect(resourceIDs).toContain(resourceID);
		}),
	);
});
