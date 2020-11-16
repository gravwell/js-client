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
import { CreatableResource, makeCreateOneResource } from './create-one-resource';
import { makeGetOneResource } from './get-one-resource';
import { makeDeleteOneResource } from './delete-one-resource';

describe('createOneResource()', () => {
	const createOneResource = makeCreateOneResource({ host: TEST_HOST, useEncryption: false });
	const getOneResource = makeGetOneResource({ host: TEST_HOST, useEncryption: false });
	const deleteOneResource = makeDeleteOneResource({ host: TEST_HOST, useEncryption: false });

	it(
		'Should create an resource and return it',
		integrationTest(async () => {
			const data: CreatableResource = {
				name: 'Resource name',
				description: 'Resource description',
			};

			const resource = await createOneResource(TEST_AUTH_TOKEN, data);
			expect(isResource(resource)).toBeTrue();
			const _resource = await getOneResource(TEST_AUTH_TOKEN, resource.id);
			expect(isResource(_resource)).toBeTrue();

			await deleteOneResource(TEST_AUTH_TOKEN, resource.id);
		}),
	);
});
