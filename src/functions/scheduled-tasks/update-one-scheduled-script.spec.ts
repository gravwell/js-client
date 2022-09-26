/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isScheduledScript, ScheduledScript, UpdatableScheduledScript } from '~/models';
import { integrationTest, integrationTestSpecDef, myCustomMatchers, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneScheduledScript } from './create-one-scheduled-script';
import { makeDeleteAllScheduledScripts } from './delete-all-scheduled-scripts';
import { makeUpdateOneScheduledScript } from './update-one-scheduled-script';

describe(
	'updateOneScheduledScript()',
	integrationTestSpecDef(() => {
		let createOneScheduledScript: ReturnType<typeof makeCreateOneScheduledScript>;
		beforeAll(async () => {
			createOneScheduledScript = makeCreateOneScheduledScript(await TEST_BASE_API_CONTEXT());
		});
		let updateOneScheduledScript: ReturnType<typeof makeUpdateOneScheduledScript>;
		beforeAll(async () => {
			updateOneScheduledScript = makeUpdateOneScheduledScript(await TEST_BASE_API_CONTEXT());
		});
		let deleteAllScheduledScripts: ReturnType<typeof makeDeleteAllScheduledScripts>;
		beforeAll(async () => {
			deleteAllScheduledScripts = makeDeleteAllScheduledScripts(await TEST_BASE_API_CONTEXT());
		});

		let createdScheduledScript: ScheduledScript;

		beforeEach(async () => {
			jasmine.addMatchers(myCustomMatchers);

			await deleteAllScheduledScripts();
			createdScheduledScript = await createOneScheduledScript({
				name: 'Script1',
				description: 'D1',
				schedule: '0 1 * * *',
				script: '1 + 2',
			});
		});

		const updateTests: Array<Omit<UpdatableScheduledScript, 'id'>> = [
			{ name: 'New Name' },

			{ description: 'New description' },

			{ groupIDs: ['1'] },
			{ groupIDs: ['1', '2'] },
			{ groupIDs: [] },

			{ labels: ['Label 1'] },
			{ labels: ['Label 1', 'Label 2'] },
			{ labels: [] },

			{ oneShot: true },
			{ oneShot: false },

			{ isDisabled: true },
			{ isDisabled: false },

			{ schedule: '1 0 * * *' },

			{ timezone: 'America/Sao_Paulo' },
			{ timezone: null },

			{ script: '1 + 2' },

			{ isDebugging: false },
			{ isDebugging: true },
		];
		updateTests.forEach((_data, testIndex) => {
			const updatedFields = Object.keys(_data);
			const formatedUpdatedFields = updatedFields.join(', ');
			const formatedTestIndex = (testIndex + 1).toString().padStart(2, '0');

			it(
				`Test ${formatedTestIndex}: Should update a scheduled script ${formatedUpdatedFields} and return itself updated`,
				integrationTest(async () => {
					const current = createdScheduledScript;
					expect(isScheduledScript(current)).toBeTrue();

					const data: UpdatableScheduledScript = { ..._data, id: current.id };
					const updated = await updateOneScheduledScript(data);

					expect(isScheduledScript(updated)).toBeTrue();
					expect(updated).toPartiallyEqual(data);
				}),
			);
		});
	}),
);
