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
import { makeGetOneResource } from './get-one-resource';

describe('getOneResource()', () => {
	const getOneResource = makeGetOneResource({ host: TEST_HOST, useEncryption: false });
	const createOneResource = makeCreateOneResource({ host: TEST_HOST, useEncryption: false });
	const deleteOneResource = makeDeleteOneResource({ host: TEST_HOST, useEncryption: false });

	let createdResourceID: UUID;

	beforeEach(async () => {
		const data: CreatableResource = {
			name: 'a name',
			description: 'a description',
		};
		createdResourceID = (await createOneResource(TEST_AUTH_TOKEN, data)).id;
	});

	afterEach(async () => {
		await deleteOneResource(TEST_AUTH_TOKEN, createdResourceID);
	});

	it(
		'Should return a resource',
		integrationTest(async () => {
			const resource = await getOneResource(TEST_AUTH_TOKEN, createdResourceID);
			expect(isResource(resource)).toBeTrue();
		}),
	);
});
