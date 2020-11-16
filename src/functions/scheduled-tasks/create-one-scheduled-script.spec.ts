/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isScheduledScript } from '../../models';
import { integrationTest, myCustomMatchers } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { NumericID } from '../../value-objects';
import { makeCreateOneGroup } from '../groups/create-one-group';
import { makeCreateOneScheduledScript } from './create-one-scheduled-script';
import { CreatableScheduledScript } from './create-one-scheduled-task';
import { makeDeleteAllScheduledScripts } from './delete-all-scheduled-scripts';

describe('createOneScheduledScript()', () => {
	const createOneScheduledScript = makeCreateOneScheduledScript({ host: TEST_HOST, useEncryption: false });
	const createOneGroup = makeCreateOneGroup({ host: TEST_HOST, useEncryption: false });
	const deleteAllScheduledScripts = makeDeleteAllScheduledScripts({ host: TEST_HOST, useEncryption: false });

	let groupIDs: Array<NumericID>;

	beforeEach(async () => {
		jasmine.addMatchers(myCustomMatchers);

		await deleteAllScheduledScripts(TEST_AUTH_TOKEN);

		groupIDs = await Promise.all(
			Array.from({ length: 3 })
				.map((_, i) => `G${i}`)
				.map(name => createOneGroup(TEST_AUTH_TOKEN, { name })),
		);
	});

	it(
		'Should create a scheduled script and return it',
		integrationTest(async () => {
			const data: CreatableScheduledScript = {
				groupIDs,

				name: 'Script1',
				description: 'D1',

				schedule: '0 1 * * *',
				timezone: 'America/Sao_Paulo',

				script: '1 + 2',

				oneShot: true,
				isDisabled: true,
			};

			const scheduledScript = await createOneScheduledScript(TEST_AUTH_TOKEN, data);
			expect(isScheduledScript(scheduledScript)).toBeTrue();
			expect(scheduledScript).toPartiallyEqual(data);
		}),
	);
});
