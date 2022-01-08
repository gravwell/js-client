/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableScheduledScript, isScheduledScript } from '~/models';
import { integrationTest, myCustomMatchers, TEST_BASE_API_CONTEXT } from '~/tests';
import { NumericID } from '~/value-objects';
import { makeCreateOneGroup } from '../groups/create-one-group';
import { makeDeleteAllGroups } from '../groups/delete-all-groups';
import { makeCreateOneScheduledScript } from './create-one-scheduled-script';
import { makeDeleteAllScheduledScripts } from './delete-all-scheduled-scripts';

describe('createOneScheduledScript()', () => {
	const createOneScheduledScript = makeCreateOneScheduledScript(TEST_BASE_API_CONTEXT);
	const createOneGroup = makeCreateOneGroup(TEST_BASE_API_CONTEXT);
	const deleteAllScheduledScripts = makeDeleteAllScheduledScripts(TEST_BASE_API_CONTEXT);
	const deleteAllGroups = makeDeleteAllGroups(TEST_BASE_API_CONTEXT);

	let groupIDs: Array<NumericID>;

	beforeEach(async () => {
		jasmine.addMatchers(myCustomMatchers);

		await deleteAllScheduledScripts();
		await deleteAllGroups();

		groupIDs = (
			await Promise.all(
				Array.from({ length: 3 })
					.map((_, i) => `G${i}`)
					.map(name => createOneGroup({ name })),
			)
		).map(g => g.id);
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

			const scheduledScript = await createOneScheduledScript(data);
			expect(isScheduledScript(scheduledScript)).toBeTrue();
			expect(scheduledScript).toPartiallyEqual(data);
		}),
	);
});
