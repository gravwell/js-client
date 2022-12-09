/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { integrationTest, integrationTestSpecDef, TEST_BASE_API_CONTEXT } from '~/tests';
import { assertIsNotNil } from '../utils/type-guards';
import { makeCreateManyScheduledScripts } from './create-many-scheduled-scripts';
import { makeDeleteAllScheduledScripts } from './delete-all-scheduled-scripts';
import { makeDeleteOneScheduledScript } from './delete-one-scheduled-script';
import { makeGetAllScheduledScripts } from './get-all-scheduled-scripts';
import { makeGetOneScheduledScript } from './get-one-scheduled-script';

describe(
	'deleteOneScheduledScript()',
	integrationTestSpecDef(() => {
		let deleteOneScheduledScript: ReturnType<typeof makeDeleteOneScheduledScript>;
		beforeAll(async () => {
			deleteOneScheduledScript = makeDeleteOneScheduledScript(await TEST_BASE_API_CONTEXT());
		});
		let getAllScheduledScripts: ReturnType<typeof makeGetAllScheduledScripts>;
		beforeAll(async () => {
			getAllScheduledScripts = makeGetAllScheduledScripts(await TEST_BASE_API_CONTEXT());
		});
		let getOneScheduledScript: ReturnType<typeof makeGetOneScheduledScript>;
		beforeAll(async () => {
			getOneScheduledScript = makeGetOneScheduledScript(await TEST_BASE_API_CONTEXT());
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
					schedule: '0 1 * * *',
					script: '1 + 2',
				},
			]);
		});

		it(
			'Should delete a scheduled script',
			integrationTest(async () => {
				const currentScheduledScripts = await getAllScheduledScripts();
				const currentScheduledScriptIDs = currentScheduledScripts.map(m => m.id);
				expect(currentScheduledScriptIDs.length).toBe(2);

				const deleteScheduledScriptID = currentScheduledScriptIDs[0];
				assertIsNotNil(deleteScheduledScriptID);

				await deleteOneScheduledScript(deleteScheduledScriptID);
				await expectAsync(getOneScheduledScript(deleteScheduledScriptID)).toBeRejected();

				const remainingScheduledScripts = await getAllScheduledScripts();
				const remainingScheduledScriptIDs = remainingScheduledScripts.map(m => m.id);
				expect(remainingScheduledScriptIDs).not.toContain(deleteScheduledScriptID);
				expect(remainingScheduledScriptIDs.length).toBe(1);
			}),
		);
	}),
);
