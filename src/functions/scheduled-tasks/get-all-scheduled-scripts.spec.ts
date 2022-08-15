/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isScheduledTaskBase } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateManyScheduledScripts } from './create-many-scheduled-scripts';
import { makeDeleteAllScheduledScripts } from './delete-all-scheduled-scripts';
import { makeGetAllScheduledScripts } from './get-all-scheduled-scripts';

describe('getAllScheduledScripts()', () => {
	let getAllScheduledScripts: ReturnType<typeof makeGetAllScheduledScripts>;
	beforeAll(async () => {
		getAllScheduledScripts = makeGetAllScheduledScripts(await TEST_BASE_API_CONTEXT());
	});
	let deleteAllScheduledScripts: ReturnType<typeof makeDeleteAllScheduledScripts>;
	beforeAll(async () => {
		deleteAllScheduledScripts = makeDeleteAllScheduledScripts(await TEST_BASE_API_CONTEXT());
	});
	let createManyScheduledScripts: ReturnType<typeof makeCreateManyScheduledScripts>;
	beforeAll(async () => {
		createManyScheduledScripts = makeCreateManyScheduledScripts(await TEST_BASE_API_CONTEXT());
	});

	beforeEach(async () => {
		await deleteAllScheduledScripts();
	});

	it(
		'Should return all scheduled scripts',
		integrationTest(async () => {
			// Create two scheduled scripts
			await createManyScheduledScripts([
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

			const scheduledScripts = await getAllScheduledScripts();
			expect(scheduledScripts.length).toBe(2);
			expect(scheduledScripts.every(isScheduledTaskBase)).toBeTrue();
		}),
	);

	it(
		'Should return an empty array if there are no scheduled scripts',
		integrationTest(async () => {
			const scheduledScripts = await getAllScheduledScripts();
			expect(scheduledScripts.length).toBe(0);
		}),
	);
});
