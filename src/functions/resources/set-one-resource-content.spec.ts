/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableResource, isResource, Resource } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_BASE_API_CONTEXT } from '../../tests/config';
import { makeCreateOneResource } from './create-one-resource';
import { makeDeleteOneResource } from './delete-one-resource';
import { makeGetOneResourceContent } from './get-one-resource-content';
import { makeSetOneResourceContent } from './set-one-resource-content';

describe('setOneResourceContent()', () => {
	const createOneResource = makeCreateOneResource(TEST_BASE_API_CONTEXT);
	const setOneResourceContent = makeSetOneResourceContent(TEST_BASE_API_CONTEXT);
	const deleteOneResource = makeDeleteOneResource(TEST_BASE_API_CONTEXT);
	const getOneResourceContent = makeGetOneResourceContent(TEST_BASE_API_CONTEXT);

	let createdResource: Resource;

	beforeEach(async () => {
		const data: CreatableResource = {
			name: 'name',
			description: 'description',
		};
		createdResource = await createOneResource(data);
	});

	afterEach(async () => {
		await deleteOneResource(createdResource.id);
	});

	it(
		'Should set the contents of an existing resource',
		integrationTest(async () => {
			const originalResourceContent = await getOneResourceContent(createdResource.id);

			const fileContent = 'This is a file created for browser tests';
			const file = new File([fileContent], 'browser-test-file.txt');

			const resource = await setOneResourceContent(createdResource.id, file);
			const updatedResourceContent = await getOneResourceContent(createdResource.id);

			expect(isResource(resource)).toBeTrue();
			expect(originalResourceContent).not.toBe(updatedResourceContent);
			expect(createdResource.version + 1).toBe(resource.version);
			expect(fileContent).toBe(updatedResourceContent);
		}),
	);
});
