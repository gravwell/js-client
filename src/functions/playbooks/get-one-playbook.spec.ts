/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatablePlaybook, isPlaybook } from '~/models';
import { integrationTest } from '../../tests';
import { TEST_BASE_API_CONTEXT } from '../../tests/config';
import { UUID } from '../../value-objects';
import { makeCreateOnePlaybook } from './create-one-playbook';
import { makeDeleteOnePlaybook } from './delete-one-playbook';
import { makeGetOnePlaybook } from './get-one-playbook';

describe('getOnePlaybook()', () => {
	const getOnePlaybook = makeGetOnePlaybook(TEST_BASE_API_CONTEXT);
	const createOnePlaybook = makeCreateOnePlaybook(TEST_BASE_API_CONTEXT);
	const deleteOnePlaybook = makeDeleteOnePlaybook(TEST_BASE_API_CONTEXT);

	let createdPlaybookUUID: UUID;

	beforeEach(async () => {
		const data: CreatablePlaybook = {
			name: 'Playbook test',
			body: 'This is my playbook',
		};
		createdPlaybookUUID = (await createOnePlaybook(data)).uuid;
	});

	afterEach(async () => {
		await deleteOnePlaybook(createdPlaybookUUID);
	});

	it(
		'Should return an playbook',
		integrationTest(async () => {
			const playbook = await getOnePlaybook(createdPlaybookUUID);
			expect(isPlaybook(playbook)).toBeTrue();
		}),
	);
});
