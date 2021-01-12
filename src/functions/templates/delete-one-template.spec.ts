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
import { isUUID } from '../../value-objects';
import { makeCreateOneTemplate } from './create-one-template';
import { makeDeleteOneTemplate } from './delete-one-template';
import { makeGetOneTemplate } from './get-one-template';

describe('deleteOneTemplate()', () => {
	const deleteOneTemplate = makeDeleteOneTemplate({ host: TEST_HOST, useEncryption: false });
	const createOneTemplate = makeCreateOneTemplate({ host: TEST_HOST, useEncryption: false });
	const getOneTemplate = makeGetOneTemplate({ host: TEST_HOST, useEncryption: false });

	// gravwell/gravwell#2426
	xit(
		'Should delete an template',
		integrationTest(async () => {
			const data: CreatableTemplate = {
				name: 'Template test',
				isRequired: true,
				query: 'tag=netflow __VAR__',
				variable: { name: 'Variable', token: '__VAR__' },
			};

			const templateUUID = await createOneTemplate(TEST_AUTH_TOKEN, data);
			expect(isUUID(templateUUID)).toBeTrue();
			const template = await getOneTemplate(TEST_AUTH_TOKEN, templateUUID);
			expect(isTemplate(template)).toBeTrue();

			await expectAsync(deleteOneTemplate(TEST_AUTH_TOKEN, templateUUID)).toBeResolved();
			await expectAsync(getOneTemplate(TEST_AUTH_TOKEN, templateUUID)).toBeRejected();
		}),
	);
});
