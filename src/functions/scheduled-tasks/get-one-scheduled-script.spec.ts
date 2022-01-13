/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isScheduledScript, ScheduledScript } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneScheduledScript } from './create-one-scheduled-script';
import { makeDeleteAllScheduledScripts } from './delete-all-scheduled-scripts';
import { makeGetOneScheduledScript } from './get-one-scheduled-script';

describe('getOneScheduledScript()', () => {
	const getOneScheduledScript = makeGetOneScheduledScript(TEST_BASE_API_CONTEXT);
	const createOneScheduledScript = makeCreateOneScheduledScript(TEST_BASE_API_CONTEXT);
	const deleteAllScheduledScripts = makeDeleteAllScheduledScripts(TEST_BASE_API_CONTEXT);

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
});
