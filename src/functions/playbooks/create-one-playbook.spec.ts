/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatablePlaybook, isPlaybook } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOnePlaybook } from './create-one-playbook';
import { makeDeleteOnePlaybook } from './delete-one-playbook';

describe('createOnePlaybook()', () => {
	let createOnePlaybook: ReturnType<typeof makeCreateOnePlaybook>;
	beforeAll(async () => {
		createOnePlaybook = makeCreateOnePlaybook(await TEST_BASE_API_CONTEXT());
	});
	let deleteOnePlaybook: ReturnType<typeof makeDeleteOnePlaybook>;
	beforeAll(async () => {
		deleteOnePlaybook = makeDeleteOnePlaybook(await TEST_BASE_API_CONTEXT());
	});

	it(
		"Should create an playbook and return it's UUID",
		integrationTest(async () => {
			const data: CreatablePlaybook = {
				name: 'Playbook test',
				body: 'This is my playbook',
				author: {
					name: 'name',
					email: 'name@email.com',
					company: 'companyName',
					url: 'www.url.com',
				},
			};

			const playbook = await createOnePlaybook(data);
			expect(isPlaybook(playbook)).toBeTrue();

			await deleteOnePlaybook(playbook.id);
		}),
	);
});
