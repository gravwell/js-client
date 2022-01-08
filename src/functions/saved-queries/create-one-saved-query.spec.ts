/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableSavedQuery, isSavedQuery } from '~/models';
import { integrationTest, myCustomMatchers, TEST_BASE_API_CONTEXT } from '~/tests';
import { NumericID } from '~/value-objects';
import { makeCreateOneGroup } from '../groups/create-one-group';
import { makeDeleteAllGroups } from '../groups/delete-all-groups';
import { makeCreateOneSavedQuery } from './create-one-saved-query';

describe('createOneSavedQuery()', () => {
	const createOneSavedQuery = makeCreateOneSavedQuery(TEST_BASE_API_CONTEXT);
	const createOneGroup = makeCreateOneGroup(TEST_BASE_API_CONTEXT);
	const deleteAllGroups = makeDeleteAllGroups(TEST_BASE_API_CONTEXT);

	let groupIDs: Array<NumericID>;

	beforeEach(async () => {
		jasmine.addMatchers(myCustomMatchers);

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
		'Should create a saved query and return it',
		integrationTest(async () => {
			const data: CreatableSavedQuery = {
				groupIDs,
				isGlobal: true,

				name: 'name',
				description: 'description',
				labels: ['Label 1', 'Label 2'],

				query: 'tag=netflow',
			};

			const savedQuery = await createOneSavedQuery(data);
			expect(isSavedQuery(savedQuery)).toBeTrue();
			expect(savedQuery).toPartiallyEqual(data);
		}),
	);
});
