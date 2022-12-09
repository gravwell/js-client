/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isScheduledScript, ScheduledScript } from '~/models';
import { integrationTest, integrationTestSpecDef, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneScheduledScript } from './create-one-scheduled-script';
import { makeDeleteAllScheduledScripts } from './delete-all-scheduled-scripts';
import { makeGetOneScheduledScript } from './get-one-scheduled-script';

describe(
	'getOneScheduledScript()',
	integrationTestSpecDef(() => {
		let getOneScheduledScript: ReturnType<typeof makeGetOneScheduledScript>;
		beforeAll(async () => {
			getOneScheduledScript = makeGetOneScheduledScript(await TEST_BASE_API_CONTEXT());
		});
		let createOneScheduledScript: ReturnType<typeof makeCreateOneScheduledScript>;
		beforeAll(async () => {
			createOneScheduledScript = makeCreateOneScheduledScript(await TEST_BASE_API_CONTEXT());
		});
		let deleteAllScheduledScripts: ReturnType<typeof makeDeleteAllScheduledScripts>;
		beforeAll(async () => {
			deleteAllScheduledScripts = makeDeleteAllScheduledScripts(await TEST_BASE_API_CONTEXT());
		});

		let createdScheduledScript: ScheduledScript;

		beforeEach(async () => {
			await deleteAllScheduledScripts();

			// Create a scheduled script
			createdScheduledScript = await createOneScheduledScript({
				name: 'Script1',
				description: 'D1',
				schedule: '0 1 * * *',
				script: '1 + 2',
			});
		});

		it(
			'Returns a scheduled script',
			integrationTest(async () => {
				const scheduledScript = await getOneScheduledScript(createdScheduledScript.id);
				expect(isScheduledScript(scheduledScript)).toBeTrue();
				expect(scheduledScript).toEqual(createdScheduledScript);
			}),
		);

		it(
			"Returns an error if the scheduled script doesn't exist",
			integrationTest(async () => {
				await expectAsync(getOneScheduledScript('non-existent')).toBeRejected();
			}),
		);
	}),
);
