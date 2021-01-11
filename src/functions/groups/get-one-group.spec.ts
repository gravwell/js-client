/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableGroup, isGroup } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { NumericID } from '../../value-objects';
import { makeCreateOneGroup } from './create-one-group';
import { makeDeleteOneGroup } from './delete-one-group';
import { makeGetOneGroup } from './get-one-group';

describe('getOneGroup()', () => {
	const getOneGroup = makeGetOneGroup({ host: TEST_HOST, useEncryption: false });
	const createOneGroup = makeCreateOneGroup({ host: TEST_HOST, useEncryption: false });
	const deleteOneGroup = makeDeleteOneGroup({ host: TEST_HOST, useEncryption: false });

	let groupID: NumericID;

	beforeEach(async () => {
		const data: CreatableGroup = {
			name: 'Name test',
			description: 'Description test',
		};
		groupID = await createOneGroup(TEST_AUTH_TOKEN, data);
	});

	afterEach(async () => {
		await deleteOneGroup(TEST_AUTH_TOKEN, groupID);
	});

	it(
		'Should return a group',
		integrationTest(async () => {
			const group = await getOneGroup(TEST_AUTH_TOKEN, groupID);
			expect(isGroup(group)).toBeTrue();
		}),
	);
});
