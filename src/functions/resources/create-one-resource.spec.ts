/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableResource, isResource } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneResource } from './create-one-resource';
import { makeDeleteOneResource } from './delete-one-resource';
import { makeGetOneResource } from './get-one-resource';

describe('createOneResource()', () => {
	let createOneResource: ReturnType<typeof makeCreateOneResource>;
	beforeAll(async () => {
		createOneResource = makeCreateOneResource(await TEST_BASE_API_CONTEXT());
	});
	let getOneResource: ReturnType<typeof makeGetOneResource>;
	beforeAll(async () => {
		getOneResource = makeGetOneResource(await TEST_BASE_API_CONTEXT());
	});
	let deleteOneResource: ReturnType<typeof makeDeleteOneResource>;
	beforeAll(async () => {
		deleteOneResource = makeDeleteOneResource(await TEST_BASE_API_CONTEXT());
	});

	it(
		'Should create an resource and return it',
		integrationTest(async () => {
			const data: CreatableResource = {
				name: 'Resource name',
				description: 'Resource description',
			};

			const resource = await createOneResource(data);
			expect(isResource(resource)).toBeTrue();
			const _resource = await getOneResource(resource.id);
			expect(isResource(_resource)).toBeTrue();

			await deleteOneResource(resource.id);
		}),
	);
});
