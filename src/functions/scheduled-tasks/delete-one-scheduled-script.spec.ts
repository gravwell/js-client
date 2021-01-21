/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeCreateManyScheduledScripts } from './create-many-scheduled-scripts';
import { makeDeleteAllScheduledScripts } from './delete-all-scheduled-scripts';
import { makeDeleteOneScheduledScript } from './delete-one-scheduled-script';
import { makeGetAllScheduledScripts } from './get-all-scheduled-scripts';
import { makeGetOneScheduledScript } from './get-one-scheduled-script';

describe('deleteOneScheduledScript()', () => {
	const deleteOneScheduledScript = makeDeleteOneScheduledScript({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const getAllScheduledScripts = makeGetAllScheduledScripts({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const getOneScheduledScript = makeGetOneScheduledScript({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const deleteAllScheduledScripts = makeDeleteAllScheduledScripts({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const createManyScheduledScripts = makeCreateManyScheduledScripts({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
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
			await deleteOneScheduledScript(deleteScheduledScriptID);
			await expectAsync(getOneScheduledScript(deleteScheduledScriptID)).toBeRejected();

			const remainingScheduledScripts = await getAllScheduledScripts();
			const remainingScheduledScriptIDs = remainingScheduledScripts.map(m => m.id);
			expect(remainingScheduledScriptIDs).not.toContain(deleteScheduledScriptID);
			expect(remainingScheduledScriptIDs.length).toBe(1);
		}),
	);
});
