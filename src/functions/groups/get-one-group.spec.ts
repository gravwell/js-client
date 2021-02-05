/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableGroup, isGroup } from '~/models';
import { NumericID } from '~/value-objects';
import { integrationTest } from '../../tests';
import { TEST_BASE_API_CONTEXT } from '../../tests/config';
import { makeCreateOneGroup } from './create-one-group';
import { makeDeleteOneGroup } from './delete-one-group';
import { makeGetOneGroup } from './get-one-group';

describe('getOneGroup()', () => {
	const getOneGroup = makeGetOneGroup(TEST_BASE_API_CONTEXT);
	const createOneGroup = makeCreateOneGroup(TEST_BASE_API_CONTEXT);
	const deleteOneGroup = makeDeleteOneGroup(TEST_BASE_API_CONTEXT);

	let groupID: NumericID;

	beforeEach(async () => {
		const data: CreatableGroup = {
			name: 'Name test',
			description: 'Description test',
		};
		groupID = (await createOneGroup(data)).id;
	});

	afterEach(async () => {
		await deleteOneGroup(groupID);
	});

	it(
		'Should return a group',
		integrationTest(async () => {
			const group = await getOneGroup(groupID);
			expect(isGroup(group)).toBeTrue();
		}),
	);
});
