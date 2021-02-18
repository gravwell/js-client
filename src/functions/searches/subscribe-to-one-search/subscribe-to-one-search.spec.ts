/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import * as base64 from 'base-64';
import { addMinutes, subMinutes } from 'date-fns';
import { isUndefined, last as lastElt, reverse, sum, zip } from 'lodash';
import { first, last, map, takeWhile, toArray } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { RawSearchEntries, TextSearchEntries } from '~/models/search/search-entries';
import { integrationTest, sleep, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeIngestMultiLineEntry } from '../../ingestors/ingest-multi-line-entry';
import { makeGetAllTags } from '../../tags/get-all-tags';
import { makeSubscribeToOneSearch } from './subscribe-to-one-search';

interface Entry {
	timestamp: string;
	value: number;
}

describe('subscribeToOneSearch()', () => {
	// Use a randomly generated tag, so that we know exactly what we're going to query
	const tag = uuidv4();

	// The number of entries to generate
	const count = 1000;

	// The start date for generated queries
	const start = new Date(2010, 0, 0);

	// The end date for generated queries; one minute between each entry
	const end = addMinutes(start, count - 1);

	const originalData: Array<Entry> = [];

	beforeAll(async () => {
		// Generate and ingest some entries
		const ingestMultiLineEntry = makeIngestMultiLineEntry(TEST_BASE_API_CONTEXT);
		const values: Array<string> = [];
		for (let i = 0; i < count; i++) {
			const value: Entry = { timestamp: addMinutes(start, i).toISOString(), value: i };
			originalData.push(value);
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
		'Should work with queries using the raw renderer w/ count module',
		integrationTest(async () => {
			const subscribeToOneSearch = makeSubscribeToOneSearch(TEST_BASE_API_CONTEXT);
			const query = `tag=${tag} json value | count`;
			const range: [Date, Date] = [start, end];
			const metadata = { test: 'abc' };
			const search = await subscribeToOneSearch(query, range, { metadata });

			const textEntriesP = search.entries$
				.pipe(
					map(e => e as TextSearchEntries),
					takeWhile(e => !e.finished, true),
					last(),
				)
				.toPromise();

			const progressP = search.progress$
				.pipe(
					takeWhile(v => v < 100, true),
					toArray(),
				)
				.toPromise();

			const statsP = search.stats$
				.pipe(
					takeWhile(s => !s.finished, true),
					last(),
				)
				.toPromise();

			const [textEntries, progress, stats] = await Promise.all([textEntriesP, progressP, statsP]);

			////
			// Check stats
			////
			expect(stats.pipeline.length)
				.withContext('there should be two modules for this query: json and count')
				.toEqual(2);
			const [jsonModule, countModule] = stats.pipeline;

			expect(jsonModule.module).toEqual('json');
			expect(jsonModule.input.entries).withContext('json module should accept 100 entries of input').toEqual(count);
			expect(jsonModule.output.entries).withContext('json module should produce 100 entries of output').toEqual(count);

			expect(countModule.module).toEqual('count');
			expect(countModule.input.entries).withContext('count module should accept 100 entries of input').toEqual(count);
			expect(countModule.output.entries)
				.withContext('count module should produce 1 entry of output -- the count')
				.toEqual(1);

			expect(stats.metadata)
				.withContext('the search metadata should be present in the stats and unchanged')
				.toEqual(metadata);

			////
			// Check progress
			////
			if (progress.length > 1) {
				expect(progress[0].valueOf())
					.withContext('If more than one progress was emitted, the first should be 0')
					.toEqual(0);
			}
			expect(lastElt(progress)?.valueOf()).withContext('The last progress emitted should be 100%').toEqual(100);

			////
			// Check entries
			////
			expect(textEntries.data.length)
				.withContext('There should be only one entry, since we used the count module')
				.toEqual(1);
			const lastEntry = textEntries.data[0];
			expect(lastEntry).toBeDefined();
			expect(base64.decode(lastEntry.data))
				.withContext('The total count of entries should equal what we ingested')
				.toEqual(`count ${count}`);
		}),
		25000,
	);

	it(
		'Should work with queries using the raw renderer',
		integrationTest(async () => {
			const subscribeToOneSearch = makeSubscribeToOneSearch(TEST_BASE_API_CONTEXT);
			const query = `tag=${tag} json value timestamp | raw`;
			const range: [Date, Date] = [start, end];
			const search = await subscribeToOneSearch(query, range, {
				filter: { entriesOffset: { index: 0, count: count } },
			});

			const textEntriesP = search.entries$
				.pipe(
					map(e => e as RawSearchEntries),
					takeWhile(e => !e.finished, true),
					last(),
				)
				.toPromise();

			const statsP = search.stats$
				.pipe(
					takeWhile(e => !e.finished, true),
					toArray(),
				)
				.toPromise();

			const [textEntries, stats, statsOverview, statsZoom] = await Promise.all([
				textEntriesP,
				statsP,
				search.statsOverview$.pipe(first()).toPromise(),
				search.statsZoom$.pipe(first()).toPromise(),
			]);

			////
			// Check entries
			////
			expect(textEntries.data.length)
				.withContext('The number of entries should equal the total ingested')
				.toEqual(count);

			zip(textEntries.data, reverse(originalData)).forEach(([entry, original], index) => {
				if (isUndefined(entry) || isUndefined(original)) {
					fail('Exptected all entries and original data to be defined');
					return;
				}

				const value: Entry = JSON.parse(base64.decode(entry.data));
				const enumeratedValues = entry.values;
				const [_timestamp, _value] = enumeratedValues;

				expect(_timestamp).withContext(`Each entry should have an enumerated value called "timestamp"`).toEqual({
					isEnumerated: true,
					name: 'timestamp',
					value: original.timestamp,
				});

				expect(_value).withContext(`Each entry should have an enumerated value called "value"`).toEqual({
					isEnumerated: true,
					name: 'value',
					value: original.value.toString(),
				});

				expect(value.value)
					.withContext('Each value should match its index, descending')
					.toEqual(count - index - 1);
			});

			////
			// Check stats
			////
			expect(stats.length).toBeGreaterThan(0);
			expect(sum(statsOverview.map(x => x.count)))
				.withContext('The sum of counts from statsOverview should equal the total count ingested')
				.toEqual(count);
			expect(sum(statsZoom.map(x => x.count)))
				.withContext('The sum of counts from statsZoom should equal the total count ingested')
				.toEqual(count);
		}),
		25000,
	);

	describe('stats', () => {
		it(
			'Should be evenly spread over a window matching the zoom/overview granularity',
			integrationTest(async () => {
				const subscribeToOneSearch = makeSubscribeToOneSearch(TEST_BASE_API_CONTEXT);
				const query = `tag=${tag}`;
				const minutes = 90;
				const range: [Date, Date] = [start, addMinutes(start, minutes - 1)];
				const search = await subscribeToOneSearch(query, range);

				const textEntriesP = search.entries$
					.pipe(
						map(e => e as RawSearchEntries),
						takeWhile(e => !e.finished, true),
						last(),
					)
					.toPromise();

				const statsP = search.stats$
					.pipe(
						takeWhile(e => !e.finished, true),
						toArray(),
					)
					.toPromise();

				const [textEntries, stats, statsOverview, statsZoom] = await Promise.all([
					textEntriesP,
					statsP,
					search.statsOverview$.pipe(first()).toPromise(),
					search.statsZoom$.pipe(first()).toPromise(),
				]);

				////
				// Check entries
				////
				expect(textEntries.data.length).withContext("Should be 90 entries since it's a 90 minute window").toEqual(90);
				textEntries.data.forEach((entry, index) => {
					const value: Entry = JSON.parse(base64.decode(entry.data));
					expect(value.value).toEqual(minutes - index - 1);
				});

				////
				// Check stats
				////
				expect(stats.length).withContext('expect to receive >0 stats from the stats observable').toBeGreaterThan(0);
				expect(sum(statsOverview.map(x => x.count)))
					.withContext(
						'The sum of counts from statsOverview should equal the number of minutes -- 90 entries over 90 minutes',
					)
					.toEqual(minutes);
				expect(statsOverview.every(x => x.count == 1))
					.withContext('Every statsOverview element should be 1 -- 90 entries over 90 minutes')
					.toBeTrue();
				expect(sum(statsZoom.map(x => x.count)))
					.withContext(
						'The sum of counts from statsZoom should equal the number of minutes -- 90 entries over 90 minutes',
					)
					.toEqual(minutes);
				expect(statsZoom.every(x => x.count == 1))
					.withContext('Every statsZoom element should be 1 -- 90 entries over 90 minutes')
					.toBeTrue();
			}),
			25000,
		);

		it(
			'Should adjust when the zoom window adjusts',
			integrationTest(async () => {
				const subscribeToOneSearch = makeSubscribeToOneSearch(TEST_BASE_API_CONTEXT);
				const query = `tag=${tag}`;
				const range: [Date, Date] = [start, end];
				const search = await subscribeToOneSearch(query, range, {
					filter: { entriesOffset: { index: 0, count: count } },
				});

				let [statsOverview, statsZoom] = await Promise.all([
					search.statsOverview$.pipe(first()).toPromise(),
					search.statsZoom$.pipe(first()).toPromise(),
				]);

				expect(sum(statsOverview.map(x => x.count)))
					.withContext('The sum of counts from statsOverview should equal the total count ingested')
					.toEqual(count);
				expect(sum(statsZoom.map(x => x.count)))
					.withContext('The sum of counts from statsZoom should equal the total count ingested')
					.toEqual(count);

				const delta = 500;

				// Narrow the search window by moving the end date sooner by delta minutes
				search.setFilter({ dateRange: { start, end: subMinutes(end, delta) } });

				[statsOverview, statsZoom] = await Promise.all([
					search.statsOverview$.pipe(first()).toPromise(),
					search.statsZoom$.pipe(first()).toPromise(),
				]);

				expect(sum(statsOverview.map(x => x.count)))
					.withContext('The sum of counts from statsOverview should stay the same (total ingested)')
					.toEqual(count);
				expect(sum(statsZoom.map(x => x.count)))
					.withContext('The sum of counts from statsZoom should be 500 less than total count ingested')
					.toEqual(count - delta);
			}),
			25000,
		);

		it(
			'Should provide the minimum zoom window',
			integrationTest(async () => {
				const subscribeToOneSearch = makeSubscribeToOneSearch(TEST_BASE_API_CONTEXT);

				const range: [Date, Date] = [start, end];

				// Issue a query where the minzoomwindow is predictable (1 second)
				const query1s = `tag=${tag} json value | stats mean(value) over 1s`;
				const search1s = await subscribeToOneSearch(query1s, range, {
					filter: { entriesOffset: { index: 0, count: count } },
				});

				const stats1s = await search1s.stats$
					.pipe(
						takeWhile(e => !e.finished, true),
						last(),
					)
					.toPromise();

				expect(stats1s.minZoomWindow).toEqual(1);

				// Issue a query where the minzoomwindow is predictable (33 seconds, why not)
				const query33s = `tag=${tag} json value | stats mean(value) over 33s`;
				const search33s = await subscribeToOneSearch(query33s, range, {
					filter: { entriesOffset: { index: 0, count: count } },
				});

				const stats33s = await search33s.stats$
					.pipe(
						takeWhile(e => !e.finished, true),
						last(),
					)
					.toPromise();

				expect(stats33s.minZoomWindow).toEqual(33);
			}),
			25000,
		);

		it(
			'Should adjust when the zoom window adjusts with a different granularity',
			integrationTest(async () => {
				const subscribeToOneSearch = makeSubscribeToOneSearch(TEST_BASE_API_CONTEXT);
				const query = `tag=${tag}`;
				const range: [Date, Date] = [start, end];
				const search = await subscribeToOneSearch(query, range, {
					filter: { entriesOffset: { index: 0, count: count } },
				});

				let [statsOverview, statsZoom] = await Promise.all([
					search.statsOverview$.pipe(first()).toPromise(),
					search.statsZoom$.pipe(first()).toPromise(),
				]);

				expect(sum(statsOverview.map(x => x.count)))
					.withContext('The sum of counts from statsOverview should equal the total count ingested')
					.toEqual(count);
				expect(sum(statsZoom.map(x => x.count)))
					.withContext('The sum of counts from statsZoom should equal the total count ingested')
					.toEqual(count);

				// the default
				expect(statsZoom.length).withContext('statsZoom should start with the default granularity').toEqual(90);

				const delta = 500;

				// Narrow the search window by moving the end date sooner by delta minutes using new granularity
				const newZoomGranularity = 133;
				search.setFilter({ dateRange: { start, end: subMinutes(end, delta) }, zoomGranularity: newZoomGranularity });

				[statsOverview, statsZoom] = await Promise.all([
					search.statsOverview$.pipe(first()).toPromise(),
					search.statsZoom$.pipe(first()).toPromise(),
				]);

				expect(sum(statsOverview.map(x => x.count)))
					.withContext('The sum of counts from statsOverview should stay the same (total ingested)')
					.toEqual(count);
				expect(sum(statsZoom.map(x => x.count)))
					.withContext('The sum of counts from statsZoom should be 500 less than total count ingested')
					.toEqual(count - delta);

				expect(statsZoom.length).withContext('statsZoom should use the new granularity').toEqual(newZoomGranularity);
				expect(statsOverview.length).withContext('statsZoom should use the default granularity').toEqual(90);
			}),
			25000,
		);

		it(
			'Should adjust zoom granularity and overview granularity independently',
			integrationTest(async () => {
				const subscribeToOneSearch = makeSubscribeToOneSearch(TEST_BASE_API_CONTEXT);
				const query = `tag=${tag}`;
				const range: [Date, Date] = [start, end];
				const overviewGranularity = 133;
				const search = await subscribeToOneSearch(query, range, {
					filter: { entriesOffset: { index: 0, count: count }, overviewGranularity },
				});

				let [statsOverview, statsZoom] = await Promise.all([
					search.statsOverview$.pipe(first()).toPromise(),
					search.statsZoom$.pipe(first()).toPromise(),
				]);

				expect(sum(statsOverview.map(x => x.count)))
					.withContext('The sum of counts from statsOverview should equal the total count ingested')
					.toEqual(count);
				expect(sum(statsZoom.map(x => x.count)))
					.withContext('The sum of counts from statsZoom should equal the total count ingested')
					.toEqual(count);

				expect(statsOverview.length)
					.withContext('statsZoom should start with the default granularity')
					.toEqual(overviewGranularity);
				expect(statsZoom.length).withContext('statsZoom should start with the default granularity').toEqual(90);

				const delta = 500;

				// Narrow the search window by moving the end date sooner by delta minutes using a new zoom granularity
				const newZoomGranularity = 133;
				search.setFilter({ dateRange: { start, end: subMinutes(end, delta) }, zoomGranularity: newZoomGranularity });

				[statsOverview, statsZoom] = await Promise.all([
					search.statsOverview$.pipe(first()).toPromise(),
					search.statsZoom$.pipe(first()).toPromise(),
				]);

				expect(sum(statsOverview.map(x => x.count)))
					.withContext('The sum of counts from statsOverview should stay the same (total ingested)')
					.toEqual(count);
				expect(sum(statsZoom.map(x => x.count)))
					.withContext('The sum of counts from statsZoom should be 500 less than total count ingested')
					.toEqual(count - delta);

				expect(statsZoom.length).withContext('statsZoom should use the new granularity').toEqual(newZoomGranularity);
				expect(statsOverview.length)
					.withContext('statsZoom should use the default granularity')
					.toEqual(overviewGranularity);
			}),
			25000,
		);
	});
});
