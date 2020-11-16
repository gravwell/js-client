/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isScheduledScript, ScheduledScript } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeCreateOneScheduledScript } from './create-one-scheduled-script';
import { makeDeleteAllScheduledScripts } from './delete-all-scheduled-scripts';
import { makeGetOneScheduledScript } from './get-one-scheduled-script';

describe('getOneScheduledScript()', () => {
	const getOneScheduledScript = makeGetOneScheduledScript({ host: TEST_HOST, useEncryption: false });
	const createOneScheduledScript = makeCreateOneScheduledScript({ host: TEST_HOST, useEncryption: false });
	const deleteAllScheduledScripts = makeDeleteAllScheduledScripts({ host: TEST_HOST, useEncryption: false });

	let createdScheduledScript: ScheduledScript;

	beforeEach(async () => {
		await deleteAllScheduledScripts(TEST_AUTH_TOKEN);

		// Create a scheduled script
		createdScheduledScript = await createOneScheduledScript(TEST_AUTH_TOKEN, {
			name: 'Script1',
			description: 'D1',
			schedule: '0 1 * * *',
			script: '1 + 2',
		});
	});

	it(
		'Returns a scheduled script',
		integrationTest(async () => {
			const scheduledScript = await getOneScheduledScript(TEST_AUTH_TOKEN, createdScheduledScript.id);
			expect(isScheduledScript(scheduledScript)).toBeTrue();
			expect(scheduledScript).toEqual(createdScheduledScript);
		}),
	);

	it(
		"Returns an error if the scheduled script doesn't exist",
		integrationTest(async () => {
			await expectAsync(getOneScheduledScript(TEST_AUTH_TOKEN, 'non-existent')).toBeRejected();
		}),
	);
});
