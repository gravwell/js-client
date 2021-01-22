/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableTemplate, isTemplate } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_BASE_API_CONTEXT } from '../../tests/config';
import { UUID } from '../../value-objects';
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
			isRequired: true,
			query: 'tag=netflow __VAR__',
			variable: { name: 'Variable', token: '__VAR__' },
		};
		createdTemplateUUID = await createOneTemplate(data);
	});

	afterEach(async () => {
		await deleteOneTemplate(createdTemplateUUID);
	});

	// gravwell/gravwell#2426
	xit(
		'Should return an template',
		integrationTest(async () => {
			const template = await getOneTemplate(createdTemplateUUID);
			expect(isTemplate(template)).toBeTrue();
		}),
	);
});
