/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableTemplate } from '~/models/template/creatable-template';
import { isTemplate } from '~/models/template/is-template';
import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { integrationTest } from '~/tests/test-types';
import { makeCreateOneTemplate } from './create-one-template';
import { makeDeleteOneTemplate } from './delete-one-template';

describe('createOneTemplate()', () => {
	let createOneTemplate: ReturnType<typeof makeCreateOneTemplate>;
	beforeAll(async () => {
		createOneTemplate = makeCreateOneTemplate(await TEST_BASE_API_CONTEXT());
	});
	let deleteOneTemplate: ReturnType<typeof makeDeleteOneTemplate>;
	beforeAll(async () => {
		deleteOneTemplate = makeDeleteOneTemplate(await TEST_BASE_API_CONTEXT());
	});

	it(
		"Should create an template and return it's UUID",
		integrationTest(async () => {
			const data: CreatableTemplate = {
				name: 'Template test',
				query: 'tag=netflow __VAR__',
				variables: [{ label: 'Variable', name: '__VAR__', required: true }],
			};

			const template = await createOneTemplate(data);
			expect(isTemplate(template)).toBeTrue();

			await deleteOneTemplate(template.id);
		}),
	);
});
