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

describe('createOneTemplate()', () => {
	const createOneTemplate = makeCreateOneTemplate({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const getOneTemplate = makeGetOneTemplate({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const deleteOneTemplate = makeDeleteOneTemplate({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});

	// gravwell/gravwell#2426
	xit(
		"Should create an template and return it's UUID",
		integrationTest(async () => {
			const data: CreatableTemplate = {
				name: 'Template test',
				isRequired: true,
				query: 'tag=netflow __VAR__',
				variable: { name: 'Variable', token: '__VAR__' },
			};

			const templateUUID = await createOneTemplate(data);
			expect(isUUID(templateUUID)).toBeTrue();
			const template = await getOneTemplate(templateUUID);
			expect(isTemplate(template)).toBeTrue();

			await deleteOneTemplate(templateUUID);
		}),
	);
});
