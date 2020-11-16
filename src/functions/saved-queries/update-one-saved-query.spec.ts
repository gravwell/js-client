/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isSavedQuery, SavedQuery } from '../../models';
import { integrationTest, myCustomMatchers } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { CreatableSavedQuery, makeCreateOneSavedQuery } from './create-one-saved-query';
import { makeDeleteOneSavedQuery } from './delete-one-saved-query';
import { makeGetAllSavedQueries } from './get-all-saved-queries';
import { makeUpdateOneSavedQuery, UpdatableSavedQuery } from './update-one-saved-query';

describe('updateOneSavedQuery()', () => {
	const createOneSavedQuery = makeCreateOneSavedQuery({ host: TEST_HOST, useEncryption: false });
	const updateOneSavedQuery = makeUpdateOneSavedQuery({ host: TEST_HOST, useEncryption: false });
	const deleteOneSavedQuery = makeDeleteOneSavedQuery({ host: TEST_HOST, useEncryption: false });
	const getAllSavedQueries = makeGetAllSavedQueries({ host: TEST_HOST, useEncryption: false });

	let createdSavedQuery: SavedQuery;

	beforeEach(async () => {
		jasmine.addMatchers(myCustomMatchers);

		// Delete all saved queries
		const currentSavedQueries = await getAllSavedQueries(TEST_AUTH_TOKEN);
		const currentSavedQueryIDs = currentSavedQueries.map(m => m.id);
		const deletePromises = currentSavedQueryIDs.map(savedQueryID => deleteOneSavedQuery(TEST_AUTH_TOKEN, savedQueryID));
		await Promise.all(deletePromises);

		// Create one saved query
		const data: CreatableSavedQuery = {
			name: 'Current name',
			query: 'tag=netflow',
		};
		createdSavedQuery = await createOneSavedQuery(TEST_AUTH_TOKEN, data);
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

		{ defaultTimeframe: { timeframe: 'thisMonth', durationString: 'thisMonth' } },
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
				const updated = await updateOneSavedQuery(TEST_AUTH_TOKEN, data);

				expect(isSavedQuery(updated)).toBeTrue();
				expect(updated).toPartiallyEqual(data);
			}),
		);
	});
});
