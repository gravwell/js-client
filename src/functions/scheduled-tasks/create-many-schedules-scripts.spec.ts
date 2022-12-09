/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableScheduledScript, isScheduledScript } from '~/models';
import { integrationTest, integrationTestSpecDef, myCustomMatchers, TEST_BASE_API_CONTEXT } from '~/tests';
import { NumericID } from '~/value-objects';
import { makeCreateOneGroup } from '../groups/create-one-group';
import { makeDeleteAllGroups } from '../groups/delete-all-groups';
import { makeCreateManyScheduledScripts } from './create-many-scheduled-scripts';
import { makeDeleteAllScheduledScripts } from './delete-all-scheduled-scripts';

describe(
	'createManyScheduledScripts()',
	integrationTestSpecDef(() => {
		let createManyScheduledScripts: ReturnType<typeof makeCreateManyScheduledScripts>;
		beforeAll(async () => {
			createManyScheduledScripts = makeCreateManyScheduledScripts(await TEST_BASE_API_CONTEXT());
		});
		let createOneGroup: ReturnType<typeof makeCreateOneGroup>;
		beforeAll(async () => {
			createOneGroup = makeCreateOneGroup(await TEST_BASE_API_CONTEXT());
		});
		let deleteAllScheduledScripts: ReturnType<typeof makeDeleteAllScheduledScripts>;
		beforeAll(async () => {
			deleteAllScheduledScripts = makeDeleteAllScheduledScripts(await TEST_BASE_API_CONTEXT());
		});
		let deleteAllGroups: ReturnType<typeof makeDeleteAllGroups>;
		beforeAll(async () => {
			deleteAllGroups = makeDeleteAllGroups(await TEST_BASE_API_CONTEXT());
		});

		let groupIDs: Array<NumericID>;

		beforeEach(async () => {
			jasmine.addMatchers(myCustomMatchers);

			await deleteAllScheduledScripts();
			await deleteAllGroups();

			groupIDs = (
				await Promise.all(
					Array.from({ length: 3 })
						.map((_, i) => `G${i}`)
						.map(name => createOneGroup({ name })),
				)
			).map(g => g.id);
		});

		it(
			'Should create a scheduled script and return it',
			integrationTest(async () => {
				const data: Array<CreatableScheduledScript> = [
					{
						groupIDs,

						name: 'Script1',
						description: 'D1',
						labels: ['test'],

						schedule: '0 1 * * *',
						timezone: 'America/Sao_Paulo',

						script: '1 + 2',
						isDebugging: true,

						oneShot: true,
						isDisabled: true,
					},
					{
						groupIDs,

						name: 'Script2',
						description: 'D2',

						schedule: '0 1 * * *',
						timezone: null,

						script: '1 + 2',
						isDebugging: false,

						oneShot: false,
						isDisabled: false,
					},
				];

				const scheduledScripts = await createManyScheduledScripts(data);
				for (const q of scheduledScripts) {
					expect(isScheduledScript(q)).toBeTrue();
				}
				expect(scheduledScripts).toPartiallyEqual(data);
			}),
		);
	}),
);
