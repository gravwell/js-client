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
import { makeCreateOneResource } from './create-one-resource';
import { makeDeleteOneResource } from './delete-one-resource';
import { makeGetOneResource } from './get-one-resource';

describe('deleteOneResource()', () => {
	const deleteOneResource = makeDeleteOneResource({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const createOneResource = makeCreateOneResource({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const getOneResource = makeGetOneResource({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });

	it(
		'Should delete a resource',
		integrationTest(async () => {
			const data: CreatableResource = {
				name: 'Resource test',
				description: 'Resource description',
			};

			const resource = await createOneResource(data);
			expect(isResource(resource)).toBeTrue();

			await expectAsync(getOneResource(resource.id)).toBeResolved();
			await expectAsync(deleteOneResource(resource.id)).toBeResolved();
			await expectAsync(getOneResource(resource.id)).toBeRejected();
		}),
	);
});
