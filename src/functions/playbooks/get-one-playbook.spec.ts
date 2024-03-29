/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatablePlaybook } from '~/models/playbook/creatable-playbook';
import { isPlaybook } from '~/models/playbook/is-playbook';
import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { integrationTest, integrationTestSpecDef } from '~/tests/test-types';
import { UUID } from '~/value-objects/id';
import { makeCreateOnePlaybook } from './create-one-playbook';
import { makeDeleteOnePlaybook } from './delete-one-playbook';
import { makeGetOnePlaybook } from './get-one-playbook';

describe(
	'getOnePlaybook()',
	integrationTestSpecDef(() => {
		let getOnePlaybook: ReturnType<typeof makeGetOnePlaybook>;
		beforeAll(async () => {
			getOnePlaybook = makeGetOnePlaybook(await TEST_BASE_API_CONTEXT());
		});
		let createOnePlaybook: ReturnType<typeof makeCreateOnePlaybook>;
		beforeAll(async () => {
			createOnePlaybook = makeCreateOnePlaybook(await TEST_BASE_API_CONTEXT());
		});
		let deleteOnePlaybook: ReturnType<typeof makeDeleteOnePlaybook>;
		beforeAll(async () => {
			deleteOnePlaybook = makeDeleteOnePlaybook(await TEST_BASE_API_CONTEXT());
		});

		let createdPlaybookUUID: UUID;

		beforeEach(async () => {
			const data: CreatablePlaybook = {
				name: 'Playbook test',
				body: 'This is my playbook',
			};
			createdPlaybookUUID = (await createOnePlaybook(data)).id;
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
	}),
);
