/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableSavedQuery, isSavedQuery, SavedQuery, UpdatableSavedQuery } from '~/models';
import { integrationTest, myCustomMatchers, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneSavedQuery } from './create-one-saved-query';
import { makeDeleteOneSavedQuery } from './delete-one-saved-query';
import { makeGetAllSavedQueries } from './get-all-saved-queries';
import { makeUpdateOneSavedQuery } from './update-one-saved-query';

describe('updateOneSavedQuery()', () => {
	const createOneSavedQuery = makeCreateOneSavedQuery(TEST_BASE_API_CONTEXT);
	const updateOneSavedQuery = makeUpdateOneSavedQuery(TEST_BASE_API_CONTEXT);
	const deleteOneSavedQuery = makeDeleteOneSavedQuery(TEST_BASE_API_CONTEXT);
	const getAllSavedQueries = makeGetAllSavedQueries(TEST_BASE_API_CONTEXT);

	let createdSavedQuery: SavedQuery;

	beforeEach(async () => {
		jasmine.addMatchers(myCustomMatchers);

		// Delete all saved queries
		const currentSavedQueries = await getAllSavedQueries();
		const currentSavedQueryIDs = currentSavedQueries.map(m => m.id);
		const deletePromises = currentSavedQueryIDs.map(savedQueryID => deleteOneSavedQuery(savedQueryID));
		await Promise.all(deletePromises);

		// Create one saved query
		const data: CreatableSavedQuery = {
			name: 'Current name',
			query: 'tag=netflow',
		};
		createdSavedQuery = await createOneSavedQuery(data);
	});

	const updateTests: Array<Omit<UpdatableSavedQuery, 'id'>> = [
		{ name: 'New Name' },

		{ description: 'New description' },
		{ description: null },

		{ groupIDs: ['1'] },
		{ groupIDs: ['1', '2'] },
		{ groupIDs: [] },

		{ labels: ['Label 1'] },
		{ labels: ['Label 1', 'Label 2'] },
		{ labels: [] },

		{ isGlobal: true },
		{ isGlobal: false },

		{ query: 'tag=custom' },

		{ defaultTimeframe: { timeframe: 'thisMonth', durationString: 'thisMonth', timezone: null } },
		{ defaultTimeframe: null },
	];
	updateTests.forEach((_data, testIndex) => {
		const updatedFields = Object.keys(_data);
		const formatedUpdatedFields = updatedFields.join(', ');
		const formatedTestIndex = (testIndex + 1).toString().padStart(2, '0');

		it(
			`Test ${formatedTestIndex}: Should update a saved query ${formatedUpdatedFields} and return itself updated`,
			integrationTest(async () => {
				const current = createdSavedQuery;
				expect(isSavedQuery(current)).toBeTrue();

				const data: UpdatableSavedQuery = { ..._data, id: current.id };
				const updated = await updateOneSavedQuery(data);

				expect(isSavedQuery(updated)).toBeTrue();
				expect(updated).toPartiallyEqual(data);
			}),
		);
	});
});
