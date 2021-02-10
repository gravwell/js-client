/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { addMinutes } from 'date-fns';
import { chain } from 'lodash';
import { last, map, takeWhile } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { RawSearchEntries } from '~/models';
import { integrationTest, sleep, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeIngestMultiLineEntry } from '../ingestors';
import { makeSubscribeToOneSearch } from '../searches';
import { makeGetAllTags } from '../tags';
import { makeGenerateAutoExtractors } from './generate-auto-extractors';

interface Entry {
	timestamp: string;
	value: number;
}

describe('generateAutoExtractors()', () => {
	const generateAutoExtractors = makeGenerateAutoExtractors(TEST_BASE_API_CONTEXT);

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

	it(
		'Should generate auto extractors',
		integrationTest(async () => {
			const subscribeToOneSearch = makeSubscribeToOneSearch(TEST_BASE_API_CONTEXT);
			const query = `tag=${tag} limit 10`;
			const range: [Date, Date] = [start, end];
			const search = await subscribeToOneSearch(query, range);

			const entries = await search.entries$
				.pipe(
					map(e => e as RawSearchEntries),
					takeWhile(e => !e.finished, true),
					last(),
				)
				.toPromise();

			const exploreResults = await generateAutoExtractors({ tag, entries });

			expect(Object.keys(exploreResults).length).withContext('we should get >0 AX suggestions').toBeGreaterThan(0);
			expect(exploreResults['json']).withContext('we should have a JSON AX suggestion').toBeDefined();
			expect(exploreResults['json'].length).withContext('we should have >0 JSON AX suggestions').toBeGreaterThan(0);

			exploreResults['json'].forEach(ax => {
				expect(ax.autoextractor.tag).withContext('the suggested AX tag should match the provided tag').toEqual(tag);
				expect(ax.autoextractor.module).withContext('the suggested AX module should be json').toEqual('json');
				expect(ax.autoextractor.parameters)
					.withContext('the suggested AX module should break out the fields in the entries')
					.toEqual('timestamp value');
				expect(ax.explore.length).withContext('explore should have >0 elements').toBeGreaterThan(0);
				ax.explore.forEach(exploreEntry => {
					expect(exploreEntry.Elements.length)
						.withContext('explore should have two elements: one for each field (timestamp and value)')
						.toEqual(2);
					exploreEntry.Elements.forEach(elt => {
						expect(elt.Filters.length).withContext('we should have filters on explore elements').toBeGreaterThan(0);
					});
				});
			});

			chain(exploreResults)
				.omit('json') // Every AX set except 'json'
				.values() // Just the arrays of generated AXes. We don't need the keys
				.flatten() // Flatten the array of arrays to an array
				.value() // Get the result
				.forEach(ax => {
					expect(ax.explore.length).withContext('explore should have >0 elements').toBeGreaterThan(0);
					ax.explore.forEach(exploreEntry => {
						expect(exploreEntry.Elements).withContext('non-json AXes should have null elements').toBeNull();
					});
				});
		}),
		25000,
	);
});
