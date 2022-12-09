/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableActionable, isActionable } from '~/models';
import { integrationTest, integrationTestSpecDef, TEST_BASE_API_CONTEXT } from '~/tests';
import { UUID } from '~/value-objects';
import { makeCreateOneActionable } from './create-one-actionable';
import { makeDeleteOneActionable } from './delete-one-actionable';
import { makeGetAllActionables } from './get-all-actionables';

xdescribe(
	'getAllActionables()',
	integrationTestSpecDef(() => {
		let getAllActionables: ReturnType<typeof makeGetAllActionables>;
		beforeAll(async () => {
			getAllActionables = makeGetAllActionables(await TEST_BASE_API_CONTEXT());
		});
		let createOneActionable: ReturnType<typeof makeCreateOneActionable>;
		beforeAll(async () => {
			createOneActionable = makeCreateOneActionable(await TEST_BASE_API_CONTEXT());
		});
		let deleteOneActionable: ReturnType<typeof makeDeleteOneActionable>;
		beforeAll(async () => {
			deleteOneActionable = makeDeleteOneActionable(await TEST_BASE_API_CONTEXT());
		});

		let createdActionablesUUIDs: Array<UUID> = [];

		beforeEach(async () => {
			// Create two actionables
			const data: CreatableActionable = {
				name: 'Actionable test',
				actions: [{ name: 'Action test', command: { type: 'query', userQuery: 'tag=netflow' } }],
				triggers: [{ pattern: /abc/g, activatesOn: 'clicks and selection' }],
			};
			const createdActionables = await Promise.all(Array.from({ length: 2 }).map(() => createOneActionable(data)));
			createdActionablesUUIDs = createdActionables.map(a => a.id);
		});

		afterEach(async () => {
			// Delete the created actionables
			const deletePs = createdActionablesUUIDs.map(actionableUUID => deleteOneActionable(actionableUUID));
			await Promise.all(deletePs);
		});

		// gravwell/gravwell#2425
		xit(
			'Should return actionables',
			integrationTest(async () => {
				const actionables = await getAllActionables();
				const actionableUUIDs = actionables.map(a => a.id);

				expect(actionables.every(isActionable)).toBeTrue();
				expect(actionables.length).toBeGreaterThanOrEqual(createdActionablesUUIDs.length);
				for (const actionableUUID of createdActionablesUUIDs) {
					expect(actionableUUIDs).toContain(actionableUUID);
				}
			}),
		);
	}),
);
