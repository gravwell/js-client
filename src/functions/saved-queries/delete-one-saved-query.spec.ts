/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableSavedQuery } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { assertIsNotNil } from '../utils/type-guards';
import { makeCreateOneSavedQuery } from './create-one-saved-query';
import { makeDeleteOneSavedQuery } from './delete-one-saved-query';
import { makeGetAllSavedQueries } from './get-all-saved-queries';
import { makeGetOneSavedQuery } from './get-one-saved-query';

describe('deleteOneSavedQuery()', () => {
	let createOneSavedQuery: ReturnType<typeof makeCreateOneSavedQuery>;
	beforeAll(async () => {
		createOneSavedQuery = makeCreateOneSavedQuery(await TEST_BASE_API_CONTEXT());
	});
	let deleteOneSavedQuery: ReturnType<typeof makeDeleteOneSavedQuery>;
	beforeAll(async () => {
		deleteOneSavedQuery = makeDeleteOneSavedQuery(await TEST_BASE_API_CONTEXT());
	});
	let getAllSavedQueries: ReturnType<typeof makeGetAllSavedQueries>;
	beforeAll(async () => {
		getAllSavedQueries = makeGetAllSavedQueries(await TEST_BASE_API_CONTEXT());
	});
	let getOneSavedQuery: ReturnType<typeof makeGetOneSavedQuery>;
	beforeAll(async () => {
		getOneSavedQuery = makeGetOneSavedQuery(await TEST_BASE_API_CONTEXT());
	});

	beforeEach(async () => {
		// Delete all saved queries
		const currentSavedQueries = await getAllSavedQueries();
		const currentSavedQueryIDs = currentSavedQueries.map(m => m.id);
		const deletePromises = currentSavedQueryIDs.map(savedQueryID => deleteOneSavedQuery(savedQueryID));
		await Promise.all(deletePromises);

		// Create two saved queries
		const creatableSavedQueries: Array<CreatableSavedQuery> = [
			{
				name: 'Q1',
				query: 'tag=netflow',
			},
			{
				name: 'Q2',
				query: 'tag=custom-test',
			},
		];
		const createPromises = creatableSavedQueries.map(creatable => createOneSavedQuery(creatable));
		await Promise.all(createPromises);
	});

	it(
		'Should delete a saved query',
		integrationTest(async () => {
			const currentSavedQueries = await getAllSavedQueries();
			const currentSavedQueryIDs = currentSavedQueries.map(m => m.id);
			expect(currentSavedQueryIDs.length).toBe(2);

			const deleteSavedQueryID = currentSavedQueryIDs[0];
			assertIsNotNil(deleteSavedQueryID);
			await deleteOneSavedQuery(deleteSavedQueryID);
			await expectAsync(getOneSavedQuery(deleteSavedQueryID)).toBeRejected();

			const remainingSavedQueries = await getAllSavedQueries();
			const remainingSavedQueryIDs = remainingSavedQueries.map(m => m.id);
			expect(remainingSavedQueryIDs).not.toContain(deleteSavedQueryID);
			expect(remainingSavedQueryIDs.length).toBe(1);
		}),
	);
});
