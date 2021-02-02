/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import * as base64 from 'base-64';
import { addMinutes } from 'date-fns';
import { concat, from } from 'rxjs';
import { filter, first, last, takeUntil, toArray } from 'rxjs/operators';
import { RawSearchEntries, TextSearchEntries } from 'src/models/search/search-entries';
import { v4 as uuidv4 } from 'uuid';
import { integrationTest } from '../../tests';
import { TEST_BASE_API_CONTEXT } from '../../tests/config';
import { sleep } from '../../tests/utils';
import { makeIngestMultiLineEntry } from '../ingestors/ingest-multi-line-entry';
import { makeGetAllTags } from '../tags/get-all-tags';
import { makeSubscribeToOneSearch } from './subscribe-to-one-search/subscribe-to-one-search';

describe('subscribeToOneSearch()', () => {
	// Use a randomly generated tag, so that we know exactly what we're going to query
	const tag = uuidv4();

	// The number of entries to generate
	const count = 1000;

	// The start date for generated queries
	const start = new Date(2010, 0, 0);

	// The end date for generated queries
	const end = addMinutes(start, count - 1);

	beforeAll(async () => {
		// Generate and ingest some entries
		const ingestMultiLineEntry = makeIngestMultiLineEntry(TEST_BASE_API_CONTEXT);
		const values: Array<string> = [];
		for (let i = 0; i < count; i++) {
			values.push(JSON.stringify({ timestamp: addMinutes(start, i), value: i }));
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

	it(
		'Should work with queries using the raw renderer',
		integrationTest(async () => {
			const subscribeToOneSearch = makeSubscribeToOneSearch(TEST_BASE_API_CONTEXT);
			const query = `tag=${tag} json value | count`;
			const range: [Date, Date] = [start, end];
			const search = await subscribeToOneSearch(query, range);

			const result = await search.entries$
				.pipe(
					takeUntil(
						concat(
							// Wait for progress == 100...
							search.progress$.pipe(
								filter(progress => progress == 100),
								first(),
							),
							// ... then sleep after progress == 100 to make sure we have every entry
							from(sleep(1000)),
						).pipe(last()),
					),
					toArray(),
				)
				.toPromise();

			expect(result.length).toBeGreaterThan(0);

			const latest = result[result.length - 1] as TextSearchEntries;
			const lastEntry = latest.data[latest.data.length - 1];
			expect(lastEntry).toBeDefined();
			expect(base64.decode(lastEntry.value)).toEqual(`count ${count}`);
		}),
		25000,
	);

	it(
		'Should work with queries using the raw renderer',
		integrationTest(async () => {
			const subscribeToOneSearch = makeSubscribeToOneSearch(TEST_BASE_API_CONTEXT);
			const query = `tag=${tag}`;
			const range: [Date, Date] = [start, end];
			const search = await subscribeToOneSearch(query, range);

			const result = await search.entries$
				.pipe(
					takeUntil(
						concat(
							// Wait for progress == 100...
							search.progress$.pipe(
								filter(progress => progress == 100),
								first(),
							),
							// ... then sleep after progress == 100 to make sure we have every entry
							from(sleep(1000)),
						).pipe(last()),
					),
					toArray(),
				)
				.toPromise();

			expect(result.length).toBeGreaterThan(0);

			const latest = result[result.length - 1] as RawSearchEntries;

			// Currently, the default count is 100
			expect(latest.data.length).toEqual(100);
		}),
		25000,
	);
});
