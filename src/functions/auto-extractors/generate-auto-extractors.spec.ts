/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { addMinutes } from 'date-fns';
import { range } from 'lodash';
import { lastValueFrom } from 'rxjs';
import { last, map, takeWhile } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { CreatableJSONEntry, RawSearchEntries } from '~/models';
import { integrationTest, sleep, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeIngestJSONEntries } from '../ingestors';
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
		const ingestJSONEntries = makeIngestJSONEntries(TEST_BASE_API_CONTEXT);
		const values: Array<CreatableJSONEntry> = range(0, count).map(i => {
			const timestamp = addMinutes(start, i).toISOString();
			return {
				timestamp,
				tag,
				data: JSON.stringify({ timestamp, value: i }, null, 2), // Add vertical whitespace, so that JSON is recommended over CSV
			};
		});

		await ingestJSONEntries(values);

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
			const search = await subscribeToOneSearch(query, { filter: { dateRange: { start, end } } });

			const entries = await lastValueFrom(
				search.entries$.pipe(
					map(e => e as RawSearchEntries),
					takeWhile(e => !e.finished, true),
				),
			);

			const exploreResults = await generateAutoExtractors({ tag, entries });

			expect(Object.keys(exploreResults).length).withContext('we should get >0 AX suggestions').toBeGreaterThan(0);
			expect(exploreResults['json']).withContext('we should have a JSON AX suggestion').toBeDefined();
			expect(exploreResults['json'].length).withContext('we should have >0 JSON AX suggestions').toBeGreaterThan(0);

			exploreResults['json'].forEach(ax => {
				expect(ax.autoExtractor.tag).withContext('the suggested AX tag should match the provided tag').toEqual(tag);
				expect(ax.autoExtractor.module).withContext('the suggested AX module should be json').toEqual('json');
				expect(ax.confidence).withContext('json is the right module, so its confidence should be 10').toEqual(10);
				expect(ax.autoExtractor.parameters)
					.withContext('the suggested AX module should break out the fields in the entries')
					.toEqual('timestamp value');
				expect(ax.explorerEntries.length).withContext('explore should have >0 elements').toBeGreaterThan(0);
				ax.explorerEntries.forEach(exploreEntry => {
					expect(exploreEntry.elements.length)
						.withContext('explore should have two elements: one for each field (timestamp and value)')
						.toEqual(2);
					exploreEntry.elements.forEach(elt => {
						expect(elt.filters.length).withContext('we should have filters on explore elements').toBeGreaterThan(0);
					});
				});
			});

			// We can't really make assertions about what the other AX generators are going to do when we look at JSON data
		}),
		25000,
	);
});
