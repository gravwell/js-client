/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableSavedQuery, isSavedQuery, SavedQuery } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneSavedQuery } from './create-one-saved-query';
import { makeDeleteOneSavedQuery } from './delete-one-saved-query';
import { makeGetAllSavedQueries } from './get-all-saved-queries';
import { makeGetOneSavedQuery } from './get-one-saved-query';

describe('getOneSavedQuery()', () => {
	const getOneSavedQuery = makeGetOneSavedQuery(TEST_BASE_API_CONTEXT);
	const createOneSavedQuery = makeCreateOneSavedQuery(TEST_BASE_API_CONTEXT);
	const getAllSavedQueries = makeGetAllSavedQueries(TEST_BASE_API_CONTEXT);
	const deleteOneSavedQuery = makeDeleteOneSavedQuery(TEST_BASE_API_CONTEXT);

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
});
