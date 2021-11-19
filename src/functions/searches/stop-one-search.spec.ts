/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { addMinutes } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { integrationTest, sleep, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeGetAllTags } from '..';
import { makeIngestMultiLineEntry } from '../ingestors';
import { makeGetAllPersistentSearchStatus, makeSubscribeToOneSearch } from '.';
import { makeGetOnePersistentSearchStatus } from './get-one-persistent-search-status';
import { makeGetPersistentSearchStatusRelatedToMe } from './get-persistent-search-status-related-to-me';
import { makeSaveOneSearch } from './save-one-search';
import { makeStopOneSearch } from './stop one-search';

interface Entry {
	timestamp: string;
	value: number;
}

describe('stopOneSearch()', () => {
	const getPersistentSearchStatusRelatedToMe = makeGetPersistentSearchStatusRelatedToMe(TEST_BASE_API_CONTEXT);
	const saveOneSearch = makeSaveOneSearch(TEST_BASE_API_CONTEXT);
	const getOnePersistentSearchStatus = makeGetOnePersistentSearchStatus(TEST_BASE_API_CONTEXT);

	// Use a randomly generated tag, so that we know exactly what we're going to query
	const tag = uuidv4();

	// The number of entries to generate
	const count = 1000;

	// The start date for generated queries
	const start = new Date(2010, 0, 0);

	// The end date for generated queries; one minute between each entry
	const end = addMinutes(start, count - 1);

	beforeAll(async () => {
		// Generate and ingest some entries
		const ingestMultiLineEntry = makeIngestMultiLineEntry(TEST_BASE_API_CONTEXT);
		const values: Array<string> = [];
		for (let i = 0; i < count; i++) {
			const value: Entry = { timestamp: addMinutes(start, i).toISOString(), value: i };
			values.push(JSON.stringify(value));
		}
		const data: string = values.join('\n');
		await ingestMultiLineEntry({ data, tag, assumeLocalTimezone: false });

		// Check the list of tags until our new tag appears
		const getAllTags = makeGetAllTags(TEST_BASE_API_CONTEXT);
		while (!(await getAllTags()).includes(tag)) {
			// Give the backend a moment to catch up
			await sleep(1000);
		}
	}, 25000);

	xit(
		'Should stop a search',
		integrationTest(async () => {
			const stopOneSearch = makeStopOneSearch(TEST_BASE_API_CONTEXT);
			const subscribeToOneSearch = makeSubscribeToOneSearch(TEST_BASE_API_CONTEXT);
			const query = `tag=${tag} sleep 40ms`;
			const search = await subscribeToOneSearch(query, {
				filter: { entriesOffset: { index: 0, count: count }, dateRange: { start, end } },
			});

			expect(async () => await stopOneSearch(search.searchID)).not.toThrow();
		}),
		25000,
	);
});
