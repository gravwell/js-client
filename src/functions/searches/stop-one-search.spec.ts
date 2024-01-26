/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { addMinutes } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { integrationTestSpecDef } from '~/tests/test-types';
import { sleep } from '~/tests/utils';
import { makeIngestMultiLineEntry } from '../ingestors/ingest-multi-line-entry';
import { makeGetAllTags } from '../tags/get-all-tags';
import { makeStopOneSearch } from './stop-one-search';
import { makeSubscribeToOneSearch } from './subscribe-to-one-search/subscribe-to-one-search';

interface Entry {
	timestamp: string;
	value: number;
}

describe(
	'stopOneSearch()',
	integrationTestSpecDef(() => {
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
			const ingestMultiLineEntry = makeIngestMultiLineEntry(await TEST_BASE_API_CONTEXT());
			const values: Array<string> = [];
			for (let i = 0; i < count; i++) {
				const value: Entry = { timestamp: addMinutes(start, i).toISOString(), value: i };
				values.push(JSON.stringify(value));
			}
			const data: string = values.join('\n');
			await ingestMultiLineEntry({ data, tag, assumeLocalTimezone: false });

			// Check the list of tags until our new tag appears
			const getAllTags = makeGetAllTags(await TEST_BASE_API_CONTEXT());
			while (!(await getAllTags()).includes(tag)) {
				// Give the backend a moment to catch up
				await sleep(1000);
			}
		}, 25000);

		xit('Should stop a search', async () => {
			const stopOneSearch = makeStopOneSearch(await TEST_BASE_API_CONTEXT());
			const subscribeToOneSearch = makeSubscribeToOneSearch(await TEST_BASE_API_CONTEXT());
			const query = `tag=${tag} sleep 40ms`;
			const search = await subscribeToOneSearch(query, {
				filter: { entriesOffset: { index: 0, count }, dateRange: { start, end } },
			});

			expect(async () => await stopOneSearch(search.searchID)).not.toThrow();
		}, 25000);
	}),
);
