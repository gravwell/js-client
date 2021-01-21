/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableActionable, isActionable } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { isUUID } from '../../value-objects';
import { makeCreateOneActionable } from './create-one-actionable';
import { makeDeleteOneActionable } from './delete-one-actionable';
import { makeGetOneActionable } from './get-one-actionable';

describe('deleteOneActionable()', () => {
	const deleteOneActionable = makeDeleteOneActionable({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const createOneActionable = makeCreateOneActionable({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const getOneActionable = makeGetOneActionable({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});

	// gravwell/gravwell#2425
	xit(
		'Should delete an actionable',
		integrationTest(async () => {
			const data: CreatableActionable = {
				name: 'Actionable test',
				actions: [{ name: 'Action test', command: { type: 'query', userQuery: 'tag=netflow' } }],
				triggers: [{ pattern: /abc/g, activatesOn: 'clicks and selection' }],
			};

			const actionableUUID = await createOneActionable(data);
			expect(isUUID(actionableUUID)).toBeTrue();
			const actionable = await getOneActionable(actionableUUID);
			expect(isActionable(actionable)).toBeTrue();

			await expectAsync(deleteOneActionable(actionableUUID)).toBeResolved();
			await expectAsync(getOneActionable(actionableUUID)).toBeRejected();
		}),
	);
});
