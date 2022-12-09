/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableTemplate, isTemplate } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneTemplate } from './create-one-template';
import { makeDeleteOneTemplate } from './delete-one-template';
import { makeGetOneTemplate } from './get-one-template';

describe('deleteOneTemplate()', () => {
	let deleteOneTemplate: ReturnType<typeof makeDeleteOneTemplate>;
	beforeAll(async () => {
		deleteOneTemplate = makeDeleteOneTemplate(await TEST_BASE_API_CONTEXT());
	});
	let createOneTemplate: ReturnType<typeof makeCreateOneTemplate>;
	beforeAll(async () => {
		createOneTemplate = makeCreateOneTemplate(await TEST_BASE_API_CONTEXT());
	});
	let getOneTemplate: ReturnType<typeof makeGetOneTemplate>;
	beforeAll(async () => {
		getOneTemplate = makeGetOneTemplate(await TEST_BASE_API_CONTEXT());
	});

	it(
		'Should delete an template',
		integrationTest(async () => {
			const data: CreatableTemplate = {
				name: 'Template test',
				query: 'tag=netflow __VAR__',
				variables: [{ label: 'Variable', name: '__VAR__', required: true }],
			};

			const template = await createOneTemplate(data);
			expect(isTemplate(template)).toBeTrue();

			await expectAsync(deleteOneTemplate(template.id)).toBeResolved();
			await expectAsync(getOneTemplate(template.id)).toBeRejected();
		}),
	);
});
