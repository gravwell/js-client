/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableTemplate, isTemplate } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { UUID } from '~/value-objects';
import { makeCreateOneTemplate } from './create-one-template';
import { makeDeleteOneTemplate } from './delete-one-template';
import { makeGetOneTemplate } from './get-one-template';

describe('getOneTemplate()', () => {
	const getOneTemplate = makeGetOneTemplate(TEST_BASE_API_CONTEXT);
	const createOneTemplate = makeCreateOneTemplate(TEST_BASE_API_CONTEXT);
	const deleteOneTemplate = makeDeleteOneTemplate(TEST_BASE_API_CONTEXT);

	let createdTemplateUUID: UUID;

	beforeEach(async () => {
		const data: CreatableTemplate = {
			name: 'Template test',
			query: 'tag=netflow __VAR__',
			variables: [{ label: 'Variable', name: '__VAR__', required: true }],
		};
		createdTemplateUUID = (await createOneTemplate(data)).uuid;
	});

	afterEach(async () => {
		await deleteOneTemplate(createdTemplateUUID);
	});

	it(
		'Should return an template',
		integrationTest(async () => {
			const template = await getOneTemplate(createdTemplateUUID);
			expect(isTemplate(template)).toBeTrue();
		}),
	);
});
