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
import { makeGetAllTemplates } from './get-all-templates';

describe('getAllTemplates()', () => {
	const getAllTemplates = makeGetAllTemplates({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
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

	let createdTemplatesUUIDs: Array<UUID> = [];

	beforeEach(async () => {
		// Create two templates
		const data: CreatableTemplate = {
			name: 'Template test',
			isRequired: true,
			query: 'tag=netflow __VAR__',
			variable: { name: 'Variable', token: '__VAR__' },
		};
		const createdTemplatesUUIDsPs = Array.from({ length: 2 }).map(() => createOneTemplate(data));
		createdTemplatesUUIDs = await Promise.all(createdTemplatesUUIDsPs);
	});

	afterEach(async () => {
		// Delete the created templates
		const deletePs = createdTemplatesUUIDs.map(templateUUID => deleteOneTemplate(templateUUID));
		await Promise.all(deletePs);
	});

	// gravwell/gravwell#2426
	xit(
		'Should return templates',
		integrationTest(async () => {
			const templates = await getAllTemplates();
			const templateUUIDs = templates.map(a => a.uuid);

			expect(templates.every(isTemplate)).toBeTrue();
			expect(templates.length).toBeGreaterThanOrEqual(createdTemplatesUUIDs.length);
			for (const templateUUID of createdTemplatesUUIDs) expect(templateUUIDs).toContain(templateUUID);
		}),
	);
});
