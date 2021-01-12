/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isScheduledScript, ScheduledScript, UpdatableScheduledScript } from '../../models';
import { integrationTest, myCustomMatchers } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeCreateOneScheduledScript } from './create-one-scheduled-script';
import { makeDeleteAllScheduledScripts } from './delete-all-scheduled-scripts';
import { makeUpdateOneScheduledScript } from './update-one-scheduled-script';

describe('updateOneScheduledScript()', () => {
	const createOneScheduledScript = makeCreateOneScheduledScript({ host: TEST_HOST, useEncryption: false });
	const updateOneScheduledScript = makeUpdateOneScheduledScript({ host: TEST_HOST, useEncryption: false });
	const deleteAllScheduledScripts = makeDeleteAllScheduledScripts({ host: TEST_HOST, useEncryption: false });

	let createdScheduledScript: ScheduledScript;

	beforeEach(async () => {
		jasmine.addMatchers(myCustomMatchers);

		await deleteAllScheduledScripts(TEST_AUTH_TOKEN);
		createdScheduledScript = await createOneScheduledScript(TEST_AUTH_TOKEN, {
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
				const updated = await updateOneScheduledScript(TEST_AUTH_TOKEN, data);

				expect(isScheduledScript(updated)).toBeTrue();
				expect(updated).toPartiallyEqual(data);
			}),
		);
	});
});
