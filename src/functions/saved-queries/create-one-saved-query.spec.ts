/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableSavedQuery } from '~/models/saved-query/creatable-saved-query';
import { isSavedQuery } from '~/models/saved-query/is-saved-query';
import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { myCustomMatchers } from '~/tests/custom-matchers';
import { integrationTest, integrationTestSpecDef } from '~/tests/test-types';
import { NumericID } from '~/value-objects/id';
import { makeCreateOneGroup } from '../groups/create-one-group';
import { makeDeleteAllGroups } from '../groups/delete-all-groups';
import { makeCreateOneSavedQuery } from './create-one-saved-query';

describe(
	'createOneSavedQuery()',
	integrationTestSpecDef(() => {
		let createOneSavedQuery: ReturnType<typeof makeCreateOneSavedQuery>;
		beforeAll(async () => {
			createOneSavedQuery = makeCreateOneSavedQuery(await TEST_BASE_API_CONTEXT());
		});
		let createOneGroup: ReturnType<typeof makeCreateOneGroup>;
		beforeAll(async () => {
			createOneGroup = makeCreateOneGroup(await TEST_BASE_API_CONTEXT());
		});
		let deleteAllGroups: ReturnType<typeof makeDeleteAllGroups>;
		beforeAll(async () => {
			deleteAllGroups = makeDeleteAllGroups(await TEST_BASE_API_CONTEXT());
		});

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
					WriteAccess: {
						Global: false,
						GIDs: [],
					},

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
	}),
);
