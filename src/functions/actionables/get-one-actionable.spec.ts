/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableActionable } from '~/models/actionable/creatable-actionable';
import { isActionable } from '~/models/actionable/is-actionable';
import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { integrationTest, integrationTestSpecDef } from '~/tests/test-types';
import { UUID } from '~/value-objects/id';
import { makeCreateOneActionable } from './create-one-actionable';
import { makeDeleteOneActionable } from './delete-one-actionable';
import { makeGetOneActionable } from './get-one-actionable';

xdescribe(
	'getOneActionable()',
	integrationTestSpecDef(() => {
		let getOneActionable: ReturnType<typeof makeGetOneActionable>;
		beforeAll(async () => {
			getOneActionable = makeGetOneActionable(await TEST_BASE_API_CONTEXT());
		});
		let createOneActionable: ReturnType<typeof makeCreateOneActionable>;
		beforeAll(async () => {
			createOneActionable = makeCreateOneActionable(await TEST_BASE_API_CONTEXT());
		});
		let deleteOneActionable: ReturnType<typeof makeDeleteOneActionable>;
		beforeAll(async () => {
			deleteOneActionable = makeDeleteOneActionable(await TEST_BASE_API_CONTEXT());
		});

		let createdActionableUUID: UUID;

		beforeEach(async () => {
			const data: CreatableActionable = {
				name: 'Actionable test',
				actions: [{ name: 'Action test', command: { type: 'query', userQuery: 'tag=netflow' } }],
				triggers: [{ pattern: /abc/g, activatesOn: 'clicks and selection', disabled: false }],
				isDisabled: false,
			};
			createdActionableUUID = (await createOneActionable(data)).id;
		});

		afterEach(async () => {
			await deleteOneActionable(createdActionableUUID);
		});

		// gravwell/gravwell#2425
		xit(
			'Should return an actionable',
			integrationTest(async () => {
				const actionable = await getOneActionable(createdActionableUUID);
				expect(isActionable(actionable)).toBeTrue();
			}),
		);
	}),
);
