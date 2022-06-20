/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import * as base64 from 'base-64';
import { addMinutes, subMinutes } from 'date-fns';
import { isUndefined, last as lastElt, range as rangeLeft, sum, zip } from 'lodash';
import { firstValueFrom, lastValueFrom, Observable } from 'rxjs';
import { map, takeWhile, toArray } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { makeCreateOneMacro, makeDeleteOneMacro } from '~/functions/macros';
import { makeAttachToOneExplorerSearch } from '~/functions/searches/attach-to-one-explorer-search/attach-to-one-explorer-search';
import { makeSubscribeToOneExplorerSearch } from '~/functions/searches/subscribe-to-one-explorer-search';
import { DataExplorerEntry, ExplorerSearchSubscription, SearchFilter } from '~/models';
import { RawSearchEntries, TextSearchEntries } from '~/models/search/search-entries';
import { integrationTest, myCustomMatchers, sleep, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeIngestMultiLineEntry } from '../../ingestors/ingest-multi-line-entry';
import { makeGetAllTags } from '../../tags/get-all-tags';
import { expectStatsFilter, makeKeepDataRangeTest } from '../tests/keep-data-range-test.spec';

interface Entry {
	timestamp: string;
	value: number;
}

describe('attachToOneExplorerSearch()', () => {
	// Use a randomly generated tag, so that we know exactly what we're going to query
	const tag = uuidv4();

	// The number of entries to generate
	const count = 1000;

	// The start date for generated queries
	const start = new Date(2010, 0, 0);

	// The end date for generated queries; one minute between each entry
	const end = addMinutes(start, count);

	const originalData: Array<Entry> = [];

	beforeAll(async () => {
		jasmine.addMatchers(myCustomMatchers);

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
		'Should complete the observables when the search closes',
		integrationTest(async () => {
			const subscribeToOneExplorerSearch = makeSubscribeToOneExplorerSearch(TEST_BASE_API_CONTEXT);
			const attachToOneExplorerSearch = makeAttachToOneExplorerSearch(TEST_BASE_API_CONTEXT);

			const query = `tag=${tag}`;
			const searchCreated = await subscribeToOneExplorerSearch(query, { filter: { dateRange: { start, end } } });
			const search = await attachToOneExplorerSearch(searchCreated.searchID);

			let complete = 0;
			const observables: Array<Observable<any>> = [
				search.entries$,
				search.stats$,
				search.statsOverview$,
				search.statsZoom$,
				search.progress$,
				search.errors$,
			];
			for (const observable of observables) {
				observable.subscribe({
					complete: () => complete++,
				});
			}

			expect(complete).toBe(0);
			await search.close();
			expect(complete).toBe(observables.length);
		}),
		25000,
	);

	xit(
		'Should work with queries using the raw renderer w/ count module',
		integrationTest(async () => {
			// Create a macro to expand to "value" to test .query vs .effectiveQuery
			const macroName = uuidv4().toUpperCase();
			const createOneMacro = makeCreateOneMacro(TEST_BASE_API_CONTEXT);
			const deleteOneMacro = makeDeleteOneMacro(TEST_BASE_API_CONTEXT);
			const createdMacro = await createOneMacro({ name: macroName, expansion: 'value' });

			const subscribeToOneExplorerSearch = makeSubscribeToOneExplorerSearch(TEST_BASE_API_CONTEXT);
			const attachToOneExplorerSearch = makeAttachToOneExplorerSearch(TEST_BASE_API_CONTEXT);

			const query = `tag=${tag} json $${macroName} | count`;
			//const effectiveQuery = `tag=${tag} json value | count`;
			const metadata = { test: 'abc' };

			const searchCreated = await subscribeToOneExplorerSearch(query, {
				metadata,
				filter: { dateRange: { start, end } },
			});
			const search = await attachToOneExplorerSearch(searchCreated.searchID);

			const textEntriesP = lastValueFrom(
				search.entries$.pipe(
					map(e => e as TextSearchEntries),
					takeWhile(e => !e.finished, true),
				),
			);

			const progressP = lastValueFrom(
				search.progress$.pipe(
					takeWhile(v => v < 100, true),
					toArray(),
				),
			);

			const statsP = lastValueFrom(search.stats$.pipe(takeWhile(s => !s.finished, true)));

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
			expect(stats.query).withContext(`Stats should contain the user query`).toBe(query);
			// TODO: Waiting on gravwell/gravwell#3677
			// expect(stats.effectiveQuery).withContext(`Stats should contain the effective query`).toBe(effectiveQuery);

			expect(stats.downloadFormats.sort())
				.withContext(`Download formats should include .json', .text', .csv' and .archive`)
				.toEqual(['archive', 'csv', 'json', 'text']);

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

			await deleteOneMacro(createdMacro.id);
		}),
		25000,
	);

	it(
		'Should work with queries using the raw renderer',
		integrationTest(async () => {
			const subscribeToOneExplorerSearch = makeSubscribeToOneExplorerSearch(TEST_BASE_API_CONTEXT);
			const attachToOneExplorerSearch = makeAttachToOneExplorerSearch(TEST_BASE_API_CONTEXT);

			const query = `tag=${tag} json value timestamp | raw`;
			const filter: SearchFilter = { entriesOffset: { index: 0, count: count }, dateRange: { start, end } };

			const searchCreated = await subscribeToOneExplorerSearch(query, { filter });
			const search = await attachToOneExplorerSearch(searchCreated.searchID, { filter });

			const textEntriesP = lastValueFrom(
				search.entries$.pipe(
					map(e => e as RawSearchEntries & { explorerEntries: Array<DataExplorerEntry> }),
					takeWhile(e => !e.finished, true),
				),
			);

			const statsP = lastValueFrom(
				search.stats$.pipe(
					takeWhile(e => !e.finished, true),
					toArray(),
				),
			);

			const [textEntries, stats, statsOverview, statsZoom] = await Promise.all([
				textEntriesP,
				statsP,
				firstValueFrom(search.statsOverview$),
				firstValueFrom(search.statsZoom$),
			]);

			////
			// Check entries
			////
			expect(textEntries.data.length)
				.withContext('The number of entries should equal the total ingested')
				.toEqual(count);

			if (isUndefined(textEntries.filter) === false) {
				expect(textEntries.filter)
					.withContext(`The filter should be equal to the one used, plus the default values for undefined properties`)
					.toPartiallyEqual(filter);
			}

			// Concat first because .reverse modifies the array
			const reversedData = originalData.concat().reverse();

			zip(textEntries.data, reversedData).forEach(([entry, original], index) => {
				if (isUndefined(entry) || isUndefined(original)) {
					fail('Exptected all entries and original data to be defined');
					return;
				}

				const value: Entry = JSON.parse(base64.decode(entry.data));
				const enumeratedValues = entry.values;
				const _timestamp = enumeratedValues.find(v => v.name === 'timestamp')!;
				const _value = enumeratedValues.find(v => v.name === 'value')!;

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

			if (isUndefined(stats[0].filter) === false) {
				expect(stats[0].filter)
					.withContext(`The filter should be equal to the one used, plus the default values for undefined properties`)
					.toPartiallyEqual(filter);
			}
			if (isUndefined(statsZoom.filter) === false) {
				expect(statsZoom.filter)
					.withContext(`The filter should be equal to the one used, plus the default values for undefined properties`)
					.toPartiallyEqual(filter);
			}
			expect(stats[0].tags).withContext('Tag should match tag from query').toEqual([tag]);

			expect(sum(statsOverview.frequencyStats.map(x => x.count)))
				.withContext('The sum of counts from statsOverview should equal the total count ingested')
				.toEqual(count);
			expect(sum(statsZoom.frequencyStats.map(x => x.count)))
				.withContext('The sum of counts from statsZoom should equal the total count ingested')
				.toEqual(count);
		}),
		25000,
	);

	it(
		'Should treat multiple searches with the same query independently',
		integrationTest(async () => {
			// Number of multiple searches to create at the same time
			const SEARCHES_N = 4;

			const subscribeToOneExplorerSearch = makeSubscribeToOneExplorerSearch(TEST_BASE_API_CONTEXT);
			const attachToOneExplorerSearch = makeAttachToOneExplorerSearch(TEST_BASE_API_CONTEXT);

			const query = `tag=${tag} json value timestamp | raw`;
			const filter: SearchFilter = { entriesOffset: { index: 0, count: count }, dateRange: { start, end } };

			const searchesCreated = await Promise.all(
				Array.from({ length: SEARCHES_N }).map(() => subscribeToOneExplorerSearch(query, { filter })),
			);
			const searches = await Promise.all(
				searchesCreated.map(searchCreated => attachToOneExplorerSearch(searchCreated.searchID, { filter })),
			);

			// Concat first because .reverse modifies the array
			const reversedData = originalData.concat().reverse();

			const testsP = searches.map(async (search, i) => {
				const textEntriesP = lastValueFrom(
					search.entries$.pipe(
						map(e => e as RawSearchEntries),
						takeWhile(e => !e.finished, true),
					),
				);

				const statsP = lastValueFrom(
					search.stats$.pipe(
						takeWhile(e => !e.finished, true),
						toArray(),
					),
				);

				const [textEntries, stats, statsOverview, statsZoom] = await Promise.all([
					textEntriesP,
					statsP,
					firstValueFrom(search.statsOverview$),
					firstValueFrom(search.statsZoom$),
				]);

				////
				// Check entries
				////
				expect(textEntries.data.length)
					.withContext('The number of entries should equal the total ingested')
					.toEqual(count);

				if (isUndefined(textEntries.filter) === false) {
					expect(textEntries.filter)
						.withContext(`The filter should be equal to the one used, plus the default values for undefined properties`)
						.toPartiallyEqual(filter);
				}

				zip(textEntries.data, reversedData).forEach(([entry, original], index) => {
					if (isUndefined(entry) || isUndefined(original)) {
						fail('Exptected all entries and original data to be defined');
						return;
					}

					const value: Entry = JSON.parse(base64.decode(entry.data));
					const enumeratedValues = entry.values;
					const _timestamp = enumeratedValues.find(v => v.name === 'timestamp')!;
					const _value = enumeratedValues.find(v => v.name === 'value')!;

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

				if (isUndefined(stats[0].filter) === false) {
					expect(stats[0].filter)
						.withContext(`The filter should be equal to the one used, plus the default values for undefined properties`)
						.toPartiallyEqual(filter);
				}
				if (isUndefined(statsZoom.filter) === false) {
					expect(statsZoom.filter)
						.withContext(`The filter should be equal to the one used, plus the default values for undefined properties`)
						.toPartiallyEqual(filter);
				}

				expect(sum(statsOverview.frequencyStats.map(x => x.count)))
					.withContext('The sum of counts from statsOverview should equal the total count ingested')
					.toEqual(count);
				expect(sum(statsZoom.frequencyStats.map(x => x.count)))
					.withContext('The sum of counts from statsZoom should equal the total count ingested')
					.toEqual(count);
			});

			await Promise.all(testsP);
		}),
		25000,
	);

	it(
		'Should reject on an inexistent search ID',
		integrationTest(async () => {
			const attachToOneExplorerSearch = makeAttachToOneExplorerSearch(TEST_BASE_API_CONTEXT);
			const searchID = `4723947892379482378`;
			await expectAsync(attachToOneExplorerSearch(searchID)).toBeRejected();
		}),
		25000,
	);

	it(
		'Should reject searches with invalid search IDs without affecting good ones',
		integrationTest(async () => {
			const subscribeToOneExplorerSearch = makeSubscribeToOneExplorerSearch(TEST_BASE_API_CONTEXT);
			const attachToOneExplorerSearch = makeAttachToOneExplorerSearch(TEST_BASE_API_CONTEXT);

			const goodSearchID = (await subscribeToOneExplorerSearch(`tag=${tag}`)).searchID;
			const badSearchID = `4723947892379482378`;

			// Attach to a bunch of search subscriptions with different search IDs to race them
			await Promise.all([
				expectAsync(attachToOneExplorerSearch(badSearchID))
					.withContext('invalid search ID should reject')
					.toBeRejected(),
				expectAsync(attachToOneExplorerSearch(badSearchID))
					.withContext('invalid search ID should reject')
					.toBeRejected(),
				expectAsync(attachToOneExplorerSearch(goodSearchID))
					.withContext('valid search ID should resolve')
					.toBeResolved(),
				expectAsync(attachToOneExplorerSearch(badSearchID))
					.withContext('invalid search ID should reject')
					.toBeRejected(),
				expectAsync(attachToOneExplorerSearch(badSearchID))
					.withContext('invalid search ID should reject')
					.toBeRejected(),
			]);
		}),
		25000,
	);

	it(
		'Should work with several searches initiated simultaneously',
		integrationTest(async () => {
			const subscribeToOneExplorerSearch = makeSubscribeToOneExplorerSearch(TEST_BASE_API_CONTEXT);
			const attachToOneExplorerSearch = makeAttachToOneExplorerSearch(TEST_BASE_API_CONTEXT);

			const searchCreatedID = (await subscribeToOneExplorerSearch(`tag=${tag}`)).searchID;

			// Attach to a bunch of search subscriptions to race them
			await Promise.all(
				rangeLeft(0, 20).map(x =>
					expectAsync(attachToOneExplorerSearch(searchCreatedID))
						.withContext('good query should resolve')
						.toBeResolved(),
				),
			);
		}),
		25000,
	);

	describe('stats', () => {
		it(
			'Should be evenly spread over a window matching the zoom/overview granularity',
			integrationTest(async () => {
				const subscribeToOneExplorerSearch = makeSubscribeToOneExplorerSearch(TEST_BASE_API_CONTEXT);
				const attachToOneExplorerSearch = makeAttachToOneExplorerSearch(TEST_BASE_API_CONTEXT);

				const query = `tag=${tag}`;
				const minutes = 90;
				const dateRange = { start, end: addMinutes(start, minutes) };

				const searchCreated = await subscribeToOneExplorerSearch(query, { filter: { dateRange } });
				const search = await attachToOneExplorerSearch(searchCreated.searchID);

				const textEntriesP = lastValueFrom(
					search.entries$.pipe(
						map(e => e as RawSearchEntries),
						takeWhile(e => !e.finished, true),
					),
				);

				const statsP = lastValueFrom(
					search.stats$.pipe(
						takeWhile(e => !e?.finished, true),
						toArray(),
					),
				);

				const [textEntries, stats, statsOverview, statsZoom] = await Promise.all([
					textEntriesP,
					statsP,
					firstValueFrom(search.statsOverview$),
					firstValueFrom(search.statsZoom$),
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
				expect(sum(statsOverview.frequencyStats.map(x => x.count)))
					.withContext(
						'The sum of counts from statsOverview should equal the number of minutes -- 90 entries over 90 minutes',
					)
					.toEqual(minutes);
				expect(statsOverview.frequencyStats.every(x => x.count == 1))
					.withContext('Every statsOverview element should be 1 -- 90 entries over 90 minutes')
					.toBeTrue();
				expect(sum(statsZoom.frequencyStats.map(x => x.count)))
					.withContext(
						'The sum of counts from statsZoom should equal the number of minutes -- 90 entries over 90 minutes',
					)
					.toEqual(minutes);
				expect(statsZoom.frequencyStats.every(x => x.count == 1))
					.withContext('Every statsZoom element should be 1 -- 90 entries over 90 minutes')
					.toBeTrue();
			}),
			25000,
		);

		it(
			'Should adjust when the zoom window adjusts for nicely-aligned bins',
			integrationTest(async () => {
				const subscribeToOneExplorerSearch = makeSubscribeToOneExplorerSearch(TEST_BASE_API_CONTEXT);
				const attachToOneExplorerSearch = makeAttachToOneExplorerSearch(TEST_BASE_API_CONTEXT);

				const query = `tag=${tag}`;
				const filter: SearchFilter = { entriesOffset: { index: 0, count }, dateRange: { start, end } };

				const searchCreated = await subscribeToOneExplorerSearch(query, { filter });
				const search = await attachToOneExplorerSearch(searchCreated.searchID, { filter });

				await expectStatsFilter(search.stats$, filter);

				let [statsOverview, statsZoom] = await Promise.all([
					firstValueFrom(search.statsOverview$),
					firstValueFrom(search.statsZoom$),
				]);

				expect(sum(statsOverview.frequencyStats.map(x => x.count)))
					.withContext('The sum of counts from statsOverview should equal the total count ingested')
					.toEqual(count);
				expect(sum(statsZoom.frequencyStats.map(x => x.count)))
					.withContext('The sum of counts from statsZoom should equal the total count ingested')
					.toEqual(count);
				if (isUndefined(statsZoom.filter) === false) {
					expect(statsZoom.filter)
						.withContext(`The filter should be equal to the one used, plus the default values for undefined properties`)
						.toPartiallyEqual(filter);
				}

				// Choose a delta that lines up nicely with the minZoomWindow buckets.
				// The timeframe of the query is wide enough that we get a minZoomWindow > 1, which makes assertions tricky without
				// this compensation.
				const delta = 640;

				// Narrow the search window by moving the end date sooner by delta minutes
				const filter2: SearchFilter = { dateRange: { start, end: subMinutes(end, delta) } };
				search.setFilter(filter2);

				await expectStatsFilter(search.stats$, filter2);

				[statsOverview, statsZoom] = await Promise.all([
					firstValueFrom(search.statsOverview$),
					firstValueFrom(search.statsZoom$),
				]);

				expect(sum(statsOverview.frequencyStats.map(x => x.count)))
					.withContext('The sum of counts from statsOverview should stay the same (total ingested)')
					.toEqual(count);
				expect(sum(statsZoom.frequencyStats.map(x => x.count)))
					.withContext('The sum of counts from statsZoom should be "delta" less than the total count ingested')
					.toEqual(count - delta + 1); // Account for inclusive end
				if (isUndefined(statsZoom.filter) === false) {
					expect(statsZoom.filter)
						.withContext(`The filter should be equal to the one used, plus the default values for undefined properties`)
						.toPartiallyEqual({ ...filter, ...filter2 });
				}
			}),
			25000,
		);

		it(
			'Should adjust when the zoom window adjusts for odd bins',
			integrationTest(async () => {
				const subscribeToOneExplorerSearch = makeSubscribeToOneExplorerSearch(TEST_BASE_API_CONTEXT);
				const attachToOneExplorerSearch = makeAttachToOneExplorerSearch(TEST_BASE_API_CONTEXT);

				const query = `tag=${tag}`;
				const filter: SearchFilter = { entriesOffset: { index: 0, count }, dateRange: { start, end } };

				const searchCreated = await subscribeToOneExplorerSearch(query, { filter });
				const search = await attachToOneExplorerSearch(searchCreated.searchID, { filter });

				await expectStatsFilter(search.stats$, filter);

				let [statsOverview, statsZoom] = await Promise.all([
					firstValueFrom(search.statsOverview$),
					firstValueFrom(search.statsZoom$),
				]);

				expect(sum(statsOverview.frequencyStats.map(x => x.count)))
					.withContext('The sum of counts from statsOverview should equal the total count ingested')
					.toEqual(count);
				expect(sum(statsZoom.frequencyStats.map(x => x.count)))
					.withContext('The sum of counts from statsZoom should equal the total count ingested')
					.toEqual(count);
				if (isUndefined(statsZoom.filter) === false) {
					expect(statsZoom.filter)
						.withContext(`The filter should be equal to the one used, plus the default values for undefined properties`)
						.toPartiallyEqual(filter);
				}

				// Choose a delta that doesn't line up nicely with the minZoomWindow buckets.
				const delta = 500;

				// Narrow the search window by moving the end date sooner by delta minutes
				const filter2: SearchFilter = { dateRange: { start, end: subMinutes(end, delta) } };
				search.setFilter(filter2);

				await expectStatsFilter(search.stats$, filter2);

				[statsOverview, statsZoom] = await Promise.all([
					firstValueFrom(search.statsOverview$),
					firstValueFrom(search.statsZoom$),
				]);

				expect(sum(statsOverview.frequencyStats.map(x => x.count)))
					.withContext('The sum of counts from statsOverview should stay the same (total ingested)')
					.toEqual(count);
				expect(sum(statsZoom.frequencyStats.map(x => x.count)))
					.withContext('The sum of counts from statsZoom should be at least "count - delta"')
					.toBeGreaterThanOrEqual(count - delta);
				if (isUndefined(statsZoom.filter) === false) {
					expect(statsZoom.filter)
						.withContext(`The filter should be equal to the one used, plus the default values for undefined properties`)
						.toPartiallyEqual({ ...filter, ...filter2 });
				}
			}),
			25000,
		);

		it(
			'Should provide the minimum zoom window',
			integrationTest(async () => {
				const subscribeToOneExplorerSearch = makeSubscribeToOneExplorerSearch(TEST_BASE_API_CONTEXT);
				const attachToOneExplorerSearch = makeAttachToOneExplorerSearch(TEST_BASE_API_CONTEXT);

				const dateRange = { start, end };

				// Issue a query where the minzoomwindow is predictable (1 second)
				const query1s = `tag=${tag} json value | stats mean(value) over 1s`;
				const filter1s: SearchFilter = { entriesOffset: { index: 0, count: count }, dateRange };

				const search1sCreated = await subscribeToOneExplorerSearch(query1s, { filter: filter1s });
				const search1s = await attachToOneExplorerSearch(search1sCreated.searchID, { filter: filter1s });

				const stats1s = await lastValueFrom(search1s.stats$.pipe(takeWhile(e => !e.finished, true)));

				expect(stats1s.minZoomWindow).toEqual(1);
				if (isUndefined(stats1s.filter) === false) {
					expect(stats1s.filter)
						.withContext(`The filter should be equal to the one used, plus the default values for undefined properties`)
						.toPartiallyEqual(filter1s);
				}

				// Issue a query where the minzoomwindow is predictable (33 seconds, why not)
				const query33s = `tag=${tag} json value | stats mean(value) over 33s`;
				const filter33s = { entriesOffset: { index: 0, count: count }, dateRange };

				const search33sCreated = await subscribeToOneExplorerSearch(query33s, { filter: filter33s });
				const search33s = await attachToOneExplorerSearch(search33sCreated.searchID, { filter: filter33s });

				const stats33s = await lastValueFrom(search33s.stats$.pipe(takeWhile(e => !e.finished, true)));

				expect(stats33s.minZoomWindow).toEqual(33);
				if (isUndefined(stats33s.filter) === false) {
					expect(stats33s.filter)
						.withContext(`The filter should be equal to the one used, plus the default values for undefined properties`)
						.toPartiallyEqual(filter33s);
				}
			}),
			25000,
		);

		it(
			'Should adjust when the zoom window adjusts with a different granularity for nicely-aligned bins',
			integrationTest(async () => {
				const subscribeToOneExplorerSearch = makeSubscribeToOneExplorerSearch(TEST_BASE_API_CONTEXT);
				const attachToOneExplorerSearch = makeAttachToOneExplorerSearch(TEST_BASE_API_CONTEXT);

				const query = `tag=${tag}`;
				const filter1: SearchFilter = { entriesOffset: { index: 0, count: count }, dateRange: { start, end } };

				const searchCreated = await subscribeToOneExplorerSearch(query, { filter: filter1 });
				const search = await attachToOneExplorerSearch(searchCreated.searchID, { filter: filter1 });

				await expectStatsFilter(search.stats$, filter1);

				let [statsOverview, statsZoom] = await Promise.all([
					firstValueFrom(search.statsOverview$),
					firstValueFrom(search.statsZoom$),
				]);

				expect(sum(statsOverview.frequencyStats.map(x => x.count)))
					.withContext('The sum of counts from statsOverview should equal the total count ingested')
					.toEqual(count);
				expect(sum(statsZoom.frequencyStats.map(x => x.count)))
					.withContext('The sum of counts from statsZoom should equal the total count ingested')
					.toEqual(count);
				if (isUndefined(statsZoom.filter) === false) {
					expect(statsZoom.filter)
						.withContext(`The filter should be equal to the one used, plus the default values for undefined properties`)
						.toPartiallyEqual(filter1);
				}

				// the default
				expect(statsZoom.frequencyStats.length)
					.withContext('statsZoom should start with the default granularity')
					.toEqual(90);

				// Choose a delta that lines up nicely with the minZoomWindow buckets.
				// The timeframe of the query is wide enough that we get a minZoomWindow > 1, which makes assertions tricky without
				// this compensation.
				const delta = 468;

				// Narrow the search window by moving the end date sooner by delta minutes using new granularity
				const newZoomGranularity = 133;
				const filter2: SearchFilter = {
					dateRange: { start, end: subMinutes(end, delta) },
					zoomGranularity: newZoomGranularity,
				};
				search.setFilter(filter2);

				await expectStatsFilter(search.stats$, filter2);

				[statsOverview, statsZoom] = await Promise.all([
					firstValueFrom(search.statsOverview$),
					firstValueFrom(search.statsZoom$),
				]);

				expect(sum(statsOverview.frequencyStats.map(x => x.count)))
					.withContext('The sum of counts from statsOverview should stay the same (total ingested)')
					.toEqual(count);
				expect(sum(statsZoom.frequencyStats.map(x => x.count)))
					.withContext('The sum of counts from statsZoom should be "delta" less than total count ingested')
					.toEqual(count - delta + 1); // Account for inclusive end
				if (isUndefined(statsZoom.filter) === false) {
					expect(statsZoom.filter)
						.withContext(`The filter should be equal to the one used, plus the default values for undefined properties`)
						.toPartiallyEqual({ ...filter1, ...filter2 });
				}

				expect(statsZoom.frequencyStats.length)
					.withContext('statsZoom should use the new granularity')
					.toEqual(newZoomGranularity);
				expect(statsOverview.frequencyStats.length)
					.withContext('statsZoom should use the default granularity')
					.toEqual(90);
			}),
			25000,
		);

		it(
			'Should adjust when the zoom window adjusts with a different granularity for odd bins',
			integrationTest(async () => {
				const subscribeToOneExplorerSearch = makeSubscribeToOneExplorerSearch(TEST_BASE_API_CONTEXT);
				const attachToOneExplorerSearch = makeAttachToOneExplorerSearch(TEST_BASE_API_CONTEXT);

				const query = `tag=${tag}`;
				const filter1: SearchFilter = { entriesOffset: { index: 0, count: count }, dateRange: { start, end } };

				const searchCreated = await subscribeToOneExplorerSearch(query, { filter: filter1 });
				const search = await attachToOneExplorerSearch(searchCreated.searchID, { filter: filter1 });

				await expectStatsFilter(search.stats$, filter1);

				let [statsOverview, statsZoom] = await Promise.all([
					firstValueFrom(search.statsOverview$),
					firstValueFrom(search.statsZoom$),
				]);

				expect(sum(statsOverview.frequencyStats.map(x => x.count)))
					.withContext('The sum of counts from statsOverview should equal the total count ingested')
					.toEqual(count);
				expect(sum(statsZoom.frequencyStats.map(x => x.count)))
					.withContext('The sum of counts from statsZoom should equal the total count ingested')
					.toEqual(count);
				if (isUndefined(statsZoom.filter) === false) {
					expect(statsZoom.filter)
						.withContext(`The filter should be equal to the one used, plus the default values for undefined properties`)
						.toPartiallyEqual(filter1);
				}

				// the default
				expect(statsZoom.frequencyStats.length)
					.withContext('statsZoom should start with the default granularity')
					.toEqual(90);

				// Choose a delta that doesn't line up nicely with the minZoomWindow buckets.
				const delta = 500;

				// Narrow the search window by moving the end date sooner by delta minutes using new granularity
				const newZoomGranularity = 133;
				const filter2: SearchFilter = {
					dateRange: { start, end: subMinutes(end, delta) },
					zoomGranularity: newZoomGranularity,
				};
				search.setFilter(filter2);

				await expectStatsFilter(search.stats$, filter2);

				[statsOverview, statsZoom] = await Promise.all([
					firstValueFrom(search.statsOverview$),
					firstValueFrom(search.statsZoom$),
				]);

				expect(sum(statsOverview.frequencyStats.map(x => x.count)))
					.withContext('The sum of counts from statsOverview should stay the same (total ingested)')
					.toEqual(count);
				expect(sum(statsZoom.frequencyStats.map(x => x.count)))
					.withContext('The sum of counts from statsZoom should be at least "count - delta"')
					.toBeGreaterThanOrEqual(count - delta);
				if (isUndefined(statsZoom.filter) === false) {
					expect(statsZoom.filter)
						.withContext(`The filter should be equal to the one used, plus the default values for undefined properties`)
						.toPartiallyEqual({ ...filter1, ...filter2 });
				}

				expect(statsZoom.frequencyStats.length)
					.withContext('statsZoom should be less than or equal to the new granularity')
					.toBeLessThanOrEqual(newZoomGranularity);
				expect(statsZoom.frequencyStats.length)
					.withContext('statsZoom should be close to the new granularity')
					.toBeGreaterThanOrEqual(newZoomGranularity - 2);
				expect(statsOverview.frequencyStats.length)
					.withContext('statsZoom should use the default granularity')
					.toEqual(90);
			}),
			25000,
		);

		it(
			'Should adjust zoom granularity and overview granularity independently for nicely-aligned bins',
			integrationTest(async () => {
				const subscribeToOneExplorerSearch = makeSubscribeToOneExplorerSearch(TEST_BASE_API_CONTEXT);
				const attachToOneExplorerSearch = makeAttachToOneExplorerSearch(TEST_BASE_API_CONTEXT);

				const query = `tag=${tag}`;
				const overviewGranularity = 133;
				const filter1: SearchFilter = {
					entriesOffset: { index: 0, count: count },
					overviewGranularity,
					dateRange: { start, end },
				};

				const searchCreated = await subscribeToOneExplorerSearch(query, { filter: filter1 });
				const search = await attachToOneExplorerSearch(searchCreated.searchID, { filter: filter1 });

				await expectStatsFilter(search.stats$, filter1);

				let [statsOverview, statsZoom] = await Promise.all([
					firstValueFrom(search.statsOverview$),
					firstValueFrom(search.statsZoom$),
				]);

				expect(sum(statsOverview.frequencyStats.map(x => x.count)))
					.withContext('The sum of counts from statsOverview should equal the total count ingested')
					.toEqual(count);
				expect(sum(statsZoom.frequencyStats.map(x => x.count)))
					.withContext('The sum of counts from statsZoom should equal the total count ingested')
					.toEqual(count);
				if (isUndefined(statsZoom.filter) === false) {
					expect(statsZoom.filter)
						.withContext(`The filter should be equal to the one used, plus the default values for undefined properties`)
						.toPartiallyEqual(filter1);
				}

				expect(statsOverview.frequencyStats.length)
					.withContext('statsZoom should start with the default granularity')
					.toEqual(overviewGranularity);
				expect(statsZoom.frequencyStats.length)
					.withContext('statsZoom should start with the default granularity')
					.toEqual(90);

				// Choose a delta that lines up nicely with the minZoomWindow buckets.
				// The timeframe of the query is wide enough that we get a minZoomWindow > 1, which makes assertions tricky without
				// this compensation.
				const delta = 468;

				// Narrow the search window by moving the end date sooner by delta minutes using a new zoom granularity
				const newZoomGranularity = 133;
				const filter2: SearchFilter = {
					dateRange: { start, end: subMinutes(end, delta) },
					zoomGranularity: newZoomGranularity,
				};
				search.setFilter(filter2);

				await expectStatsFilter(search.stats$, filter2);

				[statsOverview, statsZoom] = await Promise.all([
					firstValueFrom(search.statsOverview$),
					firstValueFrom(search.statsZoom$),
				]);

				expect(sum(statsOverview.frequencyStats.map(x => x.count)))
					.withContext('The sum of counts from statsOverview should stay the same (total ingested)')
					.toEqual(count);
				expect(sum(statsZoom.frequencyStats.map(x => x.count)))
					.withContext('The sum of counts from statsZoom should be "delta" less than total count ingested')
					.toEqual(count - delta + 1); // Account for inclusive end
				if (isUndefined(statsZoom.filter) === false) {
					expect(statsZoom.filter)
						.withContext(`The filter should be equal to the one used, plus the default values for undefined properties`)
						.toPartiallyEqual({ ...filter1, ...filter2 });
				}

				expect(statsZoom.frequencyStats.length)
					.withContext('statsZoom should use the new granularity')
					.toEqual(newZoomGranularity);
				expect(statsOverview.frequencyStats.length)
					.withContext('statsZoom should use the default granularity')
					.toEqual(overviewGranularity);
			}),
			25000,
		);

		it(
			'Should adjust zoom granularity and overview granularity independently for odd bins',
			integrationTest(async () => {
				const subscribeToOneExplorerSearch = makeSubscribeToOneExplorerSearch(TEST_BASE_API_CONTEXT);
				const attachToOneExplorerSearch = makeAttachToOneExplorerSearch(TEST_BASE_API_CONTEXT);

				const query = `tag=${tag}`;
				const overviewGranularity = 133;
				const filter1: SearchFilter = {
					entriesOffset: { index: 0, count: count },
					overviewGranularity,
					dateRange: { start, end },
				};

				const searchCreated = await subscribeToOneExplorerSearch(query, { filter: filter1 });
				const search = await attachToOneExplorerSearch(searchCreated.searchID, { filter: filter1 });

				await expectStatsFilter(search.stats$, filter1);

				let [statsOverview, statsZoom] = await Promise.all([
					firstValueFrom(search.statsOverview$),
					firstValueFrom(search.statsZoom$),
				]);

				expect(sum(statsOverview.frequencyStats.map(x => x.count)))
					.withContext('The sum of counts from statsOverview should equal the total count ingested')
					.toEqual(count);
				expect(sum(statsZoom.frequencyStats.map(x => x.count)))
					.withContext('The sum of counts from statsZoom should equal the total count ingested')
					.toEqual(count);
				if (isUndefined(statsZoom.filter) === false) {
					expect(statsZoom.filter)
						.withContext(`The filter should be equal to the one used, plus the default values for undefined properties`)
						.toPartiallyEqual(filter1);
				}

				expect(statsOverview.frequencyStats.length)
					.withContext('statsZoom should start with the default granularity')
					.toEqual(overviewGranularity);
				expect(statsZoom.frequencyStats.length)
					.withContext('statsZoom should start with the default granularity')
					.toEqual(90);

				// Choose a delta that doesn't line up nicely with the minZoomWindow buckets.
				const delta = 500;

				// Narrow the search window by moving the end date sooner by delta minutes using a new zoom granularity
				const newZoomGranularity = 133;
				const filter2: SearchFilter = {
					dateRange: { start, end: subMinutes(end, delta) },
					zoomGranularity: newZoomGranularity,
				};
				search.setFilter(filter2);

				await expectStatsFilter(search.stats$, filter2);

				[statsOverview, statsZoom] = await Promise.all([
					firstValueFrom(search.statsOverview$),
					firstValueFrom(search.statsZoom$),
				]);

				expect(sum(statsOverview.frequencyStats.map(x => x.count)))
					.withContext('The sum of counts from statsOverview should stay the same (total ingested)')
					.toEqual(count);
				expect(sum(statsZoom.frequencyStats.map(x => x.count)))
					.withContext('The sum of counts from statsZoom should be at least "count - delta"')
					.toBeGreaterThanOrEqual(count - delta);
				if (isUndefined(statsZoom.filter) === false) {
					expect(statsZoom.filter)
						.withContext(`The filter should be equal to the one used, plus the default values for undefined properties`)
						.toPartiallyEqual({ ...filter1, ...filter2 });
				}

				expect(statsZoom.frequencyStats.length)
					.withContext('statsZoom should be less than or equal to the new granularity')
					.toBeLessThanOrEqual(newZoomGranularity);
				expect(statsZoom.frequencyStats.length)
					.withContext('statsZoom should be close to the new granularity')
					.toBeGreaterThanOrEqual(newZoomGranularity - 2);
				expect(statsOverview.frequencyStats.length)
					.withContext('statsZoom should use the default granularity')
					.toEqual(overviewGranularity);
			}),
			25000,
		);

		it(
			'Should keep the dateRange when update the filter multiple times',
			integrationTest(
				makeKeepDataRangeTest({
					start,
					end,
					count,
					createSearch: async (initialFilter: SearchFilter): Promise<ExplorerSearchSubscription> => {
						const subscribeToOneExplorerSearch = makeSubscribeToOneExplorerSearch(TEST_BASE_API_CONTEXT);
						const attachToOneExplorerSearch = makeAttachToOneExplorerSearch(TEST_BASE_API_CONTEXT);

						const query = `tag=*`;
						const searchCreated = await subscribeToOneExplorerSearch(query, { filter: initialFilter });
						return await attachToOneExplorerSearch(searchCreated.searchID, { filter: initialFilter });
					},
				}),
			),
			25000,
		);
	});
});
