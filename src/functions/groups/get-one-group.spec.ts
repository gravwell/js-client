/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableGroup, groupDecoder } from '~/models';
import { integrationTest, integrationTestSpecDef, TEST_BASE_API_CONTEXT } from '~/tests';
import { NumericID } from '~/value-objects';
import { makeCreateOneGroup } from './create-one-group';
import { makeDeleteOneGroup } from './delete-one-group';
import { makeGetOneGroup } from './get-one-group';

describe(
	'getOneGroup()',
	integrationTestSpecDef(() => {
		let getOneGroup: ReturnType<typeof makeGetOneGroup>;
		beforeAll(async () => {
			getOneGroup = makeGetOneGroup(await TEST_BASE_API_CONTEXT());
		});
		let createOneGroup: ReturnType<typeof makeCreateOneGroup>;
		beforeAll(async () => {
			createOneGroup = makeCreateOneGroup(await TEST_BASE_API_CONTEXT());
		});
		let deleteOneGroup: ReturnType<typeof makeDeleteOneGroup>;
		beforeAll(async () => {
			deleteOneGroup = makeDeleteOneGroup(await TEST_BASE_API_CONTEXT());
		});

		let groupID: NumericID;

		beforeEach(async () => {
			const data: CreatableGroup = {
				name: 'Name test ' + Date.now(),
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
				expect(groupDecoder.guard(group)).toBeTrue();
			}),
		);
	}),
);
