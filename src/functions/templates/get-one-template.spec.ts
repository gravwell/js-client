/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableTemplate, isTemplate } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { UUID } from '../../value-objects';
import { makeCreateOneTemplate } from './create-one-template';
import { makeDeleteOneTemplate } from './delete-one-template';
import { makeGetOneTemplate } from './get-one-template';

describe('getOneTemplate()', () => {
	const getOneTemplate = makeGetOneTemplate({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const createOneTemplate = makeCreateOneTemplate({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const deleteOneTemplate = makeDeleteOneTemplate({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});

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
