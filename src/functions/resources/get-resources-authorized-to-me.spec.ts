/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableResource } from '~/models/resource/creatable-resource';
import { isResource } from '~/models/resource/is-resource';
import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { integrationTest, integrationTestSpecDef } from '~/tests/test-types';
import { UUID } from '~/value-objects/id';
import { makeCreateOneResource } from './create-one-resource';
import { makeDeleteOneResource } from './delete-one-resource';
import { makeGetResourcesAuthorizedToMe } from './get-resources-authorized-to-me';

describe(
	'getResourcesAuthorizedToMe()',
	integrationTestSpecDef(() => {
		let getResourcesAuthorizedToMe: ReturnType<typeof makeGetResourcesAuthorizedToMe>;
		beforeAll(async () => {
			getResourcesAuthorizedToMe = makeGetResourcesAuthorizedToMe(await TEST_BASE_API_CONTEXT());
		});
		let createOneResource: ReturnType<typeof makeCreateOneResource>;
		beforeAll(async () => {
			createOneResource = makeCreateOneResource(await TEST_BASE_API_CONTEXT());
		});
		let deleteOneResource: ReturnType<typeof makeDeleteOneResource>;
		beforeAll(async () => {
			deleteOneResource = makeDeleteOneResource(await TEST_BASE_API_CONTEXT());
		});

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
				for (const resourceID of createdResourcesIDs) {
					expect(resourceIDs).toContain(resourceID);
				}
			}),
		);
	}),
);
