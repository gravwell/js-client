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
import { Resource } from '~/models/resource/resource';
import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { integrationTest, integrationTestSpecDef } from '~/tests/test-types';
import { makeCreateOneResource } from './create-one-resource';
import { makeDeleteOneResource } from './delete-one-resource';
import { makeGetOneResourceContent } from './get-one-resource-content';
import { makeSetOneResourceContent } from './set-one-resource-content';

describe(
	'setOneResourceContent()',
	integrationTestSpecDef(() => {
		let createOneResource: ReturnType<typeof makeCreateOneResource>;
		beforeAll(async () => {
			createOneResource = makeCreateOneResource(await TEST_BASE_API_CONTEXT());
		});
		let setOneResourceContent: ReturnType<typeof makeSetOneResourceContent>;
		beforeAll(async () => {
			setOneResourceContent = makeSetOneResourceContent(await TEST_BASE_API_CONTEXT());
		});
		let deleteOneResource: ReturnType<typeof makeDeleteOneResource>;
		beforeAll(async () => {
			deleteOneResource = makeDeleteOneResource(await TEST_BASE_API_CONTEXT());
		});
		let getOneResourceContent: ReturnType<typeof makeGetOneResourceContent>;
		beforeAll(async () => {
			getOneResourceContent = makeGetOneResourceContent(await TEST_BASE_API_CONTEXT());
		});

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
	}),
);
