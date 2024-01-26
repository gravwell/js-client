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
import { makeGetOneResource } from './get-one-resource';

describe(
	'getOneResource()',
	integrationTestSpecDef(() => {
		let getOneResource: ReturnType<typeof makeGetOneResource>;
		beforeAll(async () => {
			getOneResource = makeGetOneResource(await TEST_BASE_API_CONTEXT());
		});
		let createOneResource: ReturnType<typeof makeCreateOneResource>;
		beforeAll(async () => {
			createOneResource = makeCreateOneResource(await TEST_BASE_API_CONTEXT());
		});
		let deleteOneResource: ReturnType<typeof makeDeleteOneResource>;
		beforeAll(async () => {
			deleteOneResource = makeDeleteOneResource(await TEST_BASE_API_CONTEXT());
		});

		let createdResourceID: UUID;

		beforeEach(async () => {
			const data: CreatableResource = {
				name: 'a name',
				description: 'a description',
			};
			createdResourceID = (await createOneResource(data)).id;
		});

		afterEach(async () => {
			await deleteOneResource(createdResourceID);
		});

		it(
			'Should return a resource',
			integrationTest(async () => {
				const resource = await getOneResource(createdResourceID);
				expect(isResource(resource)).toBeTrue();
			}),
		);
	}),
);
