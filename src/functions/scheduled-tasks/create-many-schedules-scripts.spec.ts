/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableScheduledScript, isScheduledScript } from '../../models';
import { integrationTest, myCustomMatchers } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { NumericID } from '../../value-objects';
import { makeCreateOneGroup } from '../groups/create-one-group';
import { makeCreateManyScheduledScripts } from './create-many-scheduled-scripts';
import { makeDeleteAllScheduledScripts } from './delete-all-scheduled-scripts';

describe('createManyScheduledScripts()', () => {
	const createManyScheduledScripts = makeCreateManyScheduledScripts({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const createOneGroup = makeCreateOneGroup({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const deleteAllScheduledScripts = makeDeleteAllScheduledScripts({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});

	let groupIDs: Array<NumericID>;

	beforeEach(async () => {
		jasmine.addMatchers(myCustomMatchers);

		await deleteAllScheduledScripts();

		groupIDs = await Promise.all(
			Array.from({ length: 3 })
				.map((_, i) => `G${i}`)
				.map(name => createOneGroup({ name })),
		);
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
			for (const q of scheduledScripts) expect(isScheduledScript(q)).toBeTrue();
			expect(scheduledScripts).toPartiallyEqual(data);
		}),
	);
});
