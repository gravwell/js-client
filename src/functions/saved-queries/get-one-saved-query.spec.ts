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
import { SavedQuery } from '~/models/saved-query/saved-query';
import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { integrationTest, integrationTestSpecDef } from '~/tests/test-types';
import { makeCreateOneSavedQuery } from './create-one-saved-query';
import { makeDeleteOneSavedQuery } from './delete-one-saved-query';
import { makeGetAllSavedQueries } from './get-all-saved-queries';
import { makeGetOneSavedQuery } from './get-one-saved-query';

describe(
	'getOneSavedQuery()',
	integrationTestSpecDef(() => {
		let getOneSavedQuery: ReturnType<typeof makeGetOneSavedQuery>;
		beforeAll(async () => {
			getOneSavedQuery = makeGetOneSavedQuery(await TEST_BASE_API_CONTEXT());
		});
		let createOneSavedQuery: ReturnType<typeof makeCreateOneSavedQuery>;
		beforeAll(async () => {
			createOneSavedQuery = makeCreateOneSavedQuery(await TEST_BASE_API_CONTEXT());
		});
		let getAllSavedQueries: ReturnType<typeof makeGetAllSavedQueries>;
		beforeAll(async () => {
			getAllSavedQueries = makeGetAllSavedQueries(await TEST_BASE_API_CONTEXT());
		});
		let deleteOneSavedQuery: ReturnType<typeof makeDeleteOneSavedQuery>;
		beforeAll(async () => {
			deleteOneSavedQuery = makeDeleteOneSavedQuery(await TEST_BASE_API_CONTEXT());
		});

		let createdSavedQuery: SavedQuery;

		beforeEach(async () => {
			// Delete all saved queries
			const currentSavedQueries = await getAllSavedQueries();
			const currentSavedQueryIDs = currentSavedQueries.map(m => m.id);
			const deletePromises = currentSavedQueryIDs.map(savedQueryID => deleteOneSavedQuery(savedQueryID));
			await Promise.all(deletePromises);

			// Create a saved query
			const data: CreatableSavedQuery = {
				name: 'Q1',
				query: 'tag=netflow',
				access: {
					read: {
						global: false,
						groups: [],
					},
					write: {
						global: false,
						groups: [],
					},
				},
			};
			createdSavedQuery = await createOneSavedQuery(data);
		});

		it(
			'Returns a saved query',
			integrationTest(async () => {
				const savedQuery = await getOneSavedQuery(createdSavedQuery.id);
				expect(isSavedQuery(savedQuery)).toBeTrue();
				expect(savedQuery).toEqual(createdSavedQuery);
			}),
		);

		it(
			"Returns an error if the saved query doesn't exist",
			integrationTest(async () => {
				await expectAsync(getOneSavedQuery('non-existent')).toBeRejected();
			}),
		);
	}),
);
