/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isScheduledTaskBase } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeCreateManyScheduledScripts } from './create-many-scheduled-scripts';
import { makeDeleteAllScheduledScripts } from './delete-all-scheduled-scripts';
import { makeGetAllScheduledScripts } from './get-all-scheduled-scripts';

describe('getAllScheduledScripts()', () => {
	const getAllScheduledScripts = makeGetAllScheduledScripts({ host: TEST_HOST, useEncryption: false });
	const deleteAllScheduledScripts = makeDeleteAllScheduledScripts({ host: TEST_HOST, useEncryption: false });
	const createManyScheduledScripts = makeCreateManyScheduledScripts({ host: TEST_HOST, useEncryption: false });

	beforeEach(async () => {
		await deleteAllScheduledScripts(TEST_AUTH_TOKEN);
	});

	it(
		'Should return all scheduled scripts',
		integrationTest(async () => {
			// Create two scheduled scripts
			await createManyScheduledScripts(TEST_AUTH_TOKEN, [
				{
					name: 'Script1',
					description: 'D1',
					schedule: '0 1 * * *',
					script: '1 + 2',
				},
				{
					name: 'Script2',
					description: 'D2',
					schedule: '0 0 * * *',
					script: '1 + 2',
				},
			]);

			const scheduledScripts = await getAllScheduledScripts(TEST_AUTH_TOKEN);
			expect(scheduledScripts.length).toBe(2);
			expect(scheduledScripts.every(isScheduledTaskBase)).toBeTrue();
		}),
	);

	it(
		'Should return an empty array if there are no scheduled scripts',
		integrationTest(async () => {
			const scheduledScripts = await getAllScheduledScripts(TEST_AUTH_TOKEN);
			expect(scheduledScripts.length).toBe(0);
		}),
	);
});
