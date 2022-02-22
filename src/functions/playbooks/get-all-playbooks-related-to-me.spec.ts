/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatablePlaybook, isPlaybook } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { UUID } from '~/value-objects';
import { makeCreateOnePlaybook } from './create-one-playbook';
import { makeDeleteOnePlaybook } from './delete-one-playbook';
import { makeGetAllPlaybooksRelatedToMe } from './get-all-playbooks-related-to-me';

describe('getAllPlaybooksRelatedToMe()', () => {
	const getAllPlaybooksRelatedToMe = makeGetAllPlaybooksRelatedToMe(TEST_BASE_API_CONTEXT);
	const createOnePlaybook = makeCreateOnePlaybook(TEST_BASE_API_CONTEXT);
	const deleteOnePlaybook = makeDeleteOnePlaybook(TEST_BASE_API_CONTEXT);

	let createdPlaybooksUUIDs: Array<UUID> = [];

	beforeEach(async () => {
		// Create two playbooks
		const data: CreatablePlaybook = {
			name: 'Playbook test',
			body: 'This is my playbook',
		};
		const createdPlaybooksPs = Array.from({ length: 2 }).map(() => createOnePlaybook(data));
		createdPlaybooksUUIDs = (await Promise.all(createdPlaybooksPs)).map(p => p.id);
	});

	afterEach(async () => {
		// Delete the created playbooks
		const deletePs = createdPlaybooksUUIDs.map(playbookUUID => deleteOnePlaybook(playbookUUID));
		await Promise.all(deletePs);
	});

	it(
		'Should return playbooks',
		integrationTest(async () => {
			const playbooks = await getAllPlaybooksRelatedToMe();
			const playbookUUIDs = playbooks.map(a => a.id);

			expect(playbooks.map(p => ({ ...p, body: '' })).every(isPlaybook)).toBeTrue();
			expect(playbooks.length).toBeGreaterThanOrEqual(createdPlaybooksUUIDs.length);
			for (const playbookUUID of createdPlaybooksUUIDs) expect(playbookUUIDs).toContain(playbookUUID);
		}),
	);
});
