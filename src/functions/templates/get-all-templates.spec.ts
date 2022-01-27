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
import { makeGetAllTemplates } from './get-all-templates';

describe('getAllTemplates()', () => {
	const getAllTemplates = makeGetAllTemplates(TEST_BASE_API_CONTEXT);
	const createOneTemplate = makeCreateOneTemplate(TEST_BASE_API_CONTEXT);
	const deleteOneTemplate = makeDeleteOneTemplate(TEST_BASE_API_CONTEXT);

	let createdTemplatesUUIDs: Array<UUID> = [];

	beforeEach(async () => {
		// Create two templates
		const data: CreatableTemplate = {
			name: 'Template test',
			query: 'tag=netflow __VAR__',
			variables: [{ label: 'Variable', name: '__VAR__', required: true }],
		};
		const createdTemplatesPs = Array.from({ length: 2 }).map(() => createOneTemplate(data));
		createdTemplatesUUIDs = (await Promise.all(createdTemplatesPs)).map(t => t.uuid);
	});

	afterEach(async () => {
		// Delete the created templates
		const deletePs = createdTemplatesUUIDs.map(templateUUID => deleteOneTemplate(templateUUID));
		await Promise.all(deletePs);
	});

	it(
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
