/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import * as base64 from 'base-64';
import { addMinutes, isEqual as datesAreEqual, subMinutes } from 'date-fns';
import { isArray, isUndefined, sum, zip } from 'lodash';
import { firstValueFrom, lastValueFrom, Observable } from 'rxjs';
import { last, map, takeWhile, toArray } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { makeCreateOneAutoExtractor } from '~/functions/auto-extractors';
import { DataExplorerEntry, ElementFilter, isDataExplorerEntry, SearchFilter, SearchSubscription } from '~/models';
import { RawSearchEntries } from '~/models/search/search-entries';
import { integrationTest, myCustomMatchers, sleep, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeIngestMultiLineEntry } from '../../ingestors/ingest-multi-line-entry';
import { makeGetAllTags } from '../../tags/get-all-tags';
import { makeKeepDataRangeTest } from '../tests/keep-data-range-test.spec';
import { makeSubscribeToOneExplorerSearch } from './subscribe-to-one-explorer-search';

interface Entry {
	timestamp: string;
	value: { foo: number };
}

describe('subscribeToOneExplorerSearch()', () => {
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
			const value: Entry = { timestamp: addMinutes(start, i).toISOString(), value: { foo: i } };
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

		// Create an AX definition for the generated tag
		const createOneAutoExtractor = makeCreateOneAutoExtractor(TEST_BASE_API_CONTEXT);
		await createOneAutoExtractor({
			tag: tag,
			name: `${tag} - JSON`,
			description: '-',
			module: 'json',
			parameters: 'timestamp value value.foo',
		});
	}, 25000);

	it(
		'Should complete the observables when the search closes',
		integrationTest(async () => {
			const subscribeToOneExplorerSearch = makeSubscribeToOneExplorerSearch(TEST_BASE_API_CONTEXT);
			const query = `tag=${tag}`;
			const search = await subscribeToOneExplorerSearch(query, { filter: { dateRange: { start, end } } });

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

	it(
		'Should work with queries using the raw renderer',
		integrationTest(async () => {
			const subscribeToOneExplorerSearch = makeSubscribeToOneExplorerSearch(TEST_BASE_API_CONTEXT);
			const query = `tag=${tag} ax | raw`;
			const filter: SearchFilter = { entriesOffset: { index: 0, count: count }, dateRange: { start, end } };
			const search = await subscribeToOneExplorerSearch(query, { filter });

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

			const explorerEntries = textEntries.explorerEntries;
			expect(isArray(explorerEntries) && explorerEntries.every(isDataExplorerEntry))
				.withContext('Expect a promise of an array of data explorer entries')
				.toBeTrue();
			expect(explorerEntries.length).withContext(`Expect ${count} entries`).toBe(count);

			for (const entry of explorerEntries) {
				expect(entry.tag).withContext(`Expect entry tag to be "${tag}"`).toBe(tag);

				expect(entry.elements.length)
					.withContext(`Expect to have 2 data explorer elements on first depth level`)
					.toBe(2);
				expect(entry.elements.map(el => el.name).sort())
					.withContext(`Expect first depth data explorer elements to be "value" and "timestamp"`)
					.toEqual(['timestamp', 'value']);
				expect(entry.elements.map(el => el.module))
					.withContext(`Expect explorer module to be JSON`)
					.toEqual(['json', 'json']);

				const timestampEl = entry.elements.find(el => el.name === 'timestamp')!;
				const valueEl = entry.elements.find(el => el.name === 'value')!;

				expect(timestampEl.children.length).withContext(`Expect the timestamp element to not have children`).toBe(0);
				expect(valueEl.children.length).withContext(`Expect the value element to have one children`).toBe(1);
				expect(valueEl.children[0].name)
					.withContext(`Expect the value element child to be value.foo`)
					.toBe('value.foo');
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
				const _timestamp = enumeratedValues.find(v => v.name === 'timestamp');
				const _value = enumeratedValues.find(v => v.name === 'value');

				expect(_timestamp).withContext(`Each entry should have an enumerated value called "timestamp"`).toEqual({
					isEnumerated: true,
					name: 'timestamp',
					value: original.timestamp,
				});

				expect(_value)
					.withContext(`Each entry should have an enumerated value called "value"`)
					.toEqual({
						isEnumerated: true,
						name: 'value',
						value: JSON.stringify(original.value),
					});

				expect(value.value.foo)
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
		}),
		25000,
	);

	it('Should be able to apply element filters', async () => {
		const subscribeToOneExplorerSearch = makeSubscribeToOneExplorerSearch(TEST_BASE_API_CONTEXT);

		const unfilteredQuery = `tag=${tag} raw`;
		const elementFilters: Array<ElementFilter> = [
			{ path: 'value.foo', operation: '!=', value: '50', tag, module: 'json', arguments: null },
		];
		const query = `tag=${tag} json "value.foo" != "50" as "foo" | raw`;
		const countAfterFilter = count - 1;

		const filter: SearchFilter = {
			entriesOffset: { index: 0, count: count },
			elementFilters,
			dateRange: { start, end },
		};
		const search = await subscribeToOneExplorerSearch(unfilteredQuery, { filter });

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

		const [textEntries, stats] = await Promise.all([textEntriesP, statsP]);

		////
		// Check entries
		////
		expect(textEntries.data.length)
			.withContext('The number of entries should equal the total ingested')
			.toEqual(countAfterFilter);

		if (isUndefined(textEntries.filter) === false) {
			expect(textEntries.filter)
				.withContext(`The filter should be equal to the one used, plus the default values for undefined properties`)
				.toPartiallyEqual(filter);
		}

		const explorerEntries = textEntries.explorerEntries;
		expect(isArray(explorerEntries) && explorerEntries.every(isDataExplorerEntry))
			.withContext('Expect a promise of an array of data explorer entries')
			.toBeTrue();
		expect(explorerEntries.length).withContext(`Expect ${countAfterFilter} entries`).toBe(countAfterFilter);

		////
		// Check stats
		////
		expect(stats.length).toBeGreaterThan(0);
		expect(stats[0].query).toBe(query);
	});

	it(
		'Should reject on a bad query string',
		integrationTest(async () => {
			const subscribeToOneExplorerSearch = makeSubscribeToOneExplorerSearch(TEST_BASE_API_CONTEXT);
			const query = `this is an invalid query`;
			const range: [Date, Date] = [start, end];
			const filter: SearchFilter = { entriesOffset: { index: 0, count: count }, dateRange: { start, end } };

			await expectAsync(subscribeToOneExplorerSearch(query, { filter })).toBeRejected();
		}),
		25000,
	);

	it(
		'Should reject on a bad query range (end is before start)',
		integrationTest(async () => {
			const subscribeToOneExplorerSearch = makeSubscribeToOneExplorerSearch(TEST_BASE_API_CONTEXT);
			const query = `tag=${tag}`;
			const filter: SearchFilter = {
				entriesOffset: { index: 0, count: count },
				dateRange: { start, end: subMinutes(start, 10) },
			};

			await expectAsync(subscribeToOneExplorerSearch(query, { filter })).toBeRejected();
		}),
		25000,
	);

	it(
		'Should reject bad searches without affecting good ones (different queries)',
		integrationTest(async () => {
			const subscribeToOneExplorerSearch = makeSubscribeToOneExplorerSearch(TEST_BASE_API_CONTEXT);
			const goodRange = { start, end };
			const badRange = { start, end: subMinutes(start, 10) };
			const baseFilter: SearchFilter = { entriesOffset: { index: 0, count: count } };

			// Start a bunch of search subscriptions with different queries to race them
			await Promise.all([
				expectAsync(
					subscribeToOneExplorerSearch(`tag=${tag} regex "a"`, { filter: { ...baseFilter, dateRange: badRange } }),
				)
					.withContext('query with bad range should reject')
					.toBeRejected(),
				expectAsync(
					subscribeToOneExplorerSearch(`tag=${tag} regex "b"`, { filter: { ...baseFilter, dateRange: badRange } }),
				)
					.withContext('query with bad range should reject')
					.toBeRejected(),
				expectAsync(
					subscribeToOneExplorerSearch(`tag=${tag} regex "c"`, { filter: { ...baseFilter, dateRange: goodRange } }),
				)
					.withContext('good query should resolve')
					.toBeResolved(),
				expectAsync(
					subscribeToOneExplorerSearch(`tag=${tag} regex "d"`, { filter: { ...baseFilter, dateRange: badRange } }),
				)
					.withContext('query with bad range should reject')
					.toBeRejected(),
				expectAsync(
					subscribeToOneExplorerSearch(`tag=${tag} regex "e"`, { filter: { ...baseFilter, dateRange: badRange } }),
				)
					.withContext('query with bad range should reject')
					.toBeRejected(),
			]);
		}),
		25000,
	);

	it(
		'Should reject bad searches without affecting good ones (same query)',
		integrationTest(async () => {
			const subscribeToOneExplorerSearch = makeSubscribeToOneExplorerSearch(TEST_BASE_API_CONTEXT);
			const query = `tag=${tag}`;
			const goodRange = { start, end };
			const badRange = { start, end: subMinutes(start, 10) };
			const baseFilter: SearchFilter = { entriesOffset: { index: 0, count: count } };

			// Start a bunch of search subscriptions to race them
			await Promise.all([
				expectAsync(subscribeToOneExplorerSearch(query, { filter: { ...baseFilter, dateRange: badRange } }))
					.withContext('query with bad range should reject')
					.toBeRejected(),
				expectAsync(subscribeToOneExplorerSearch(query, { filter: { ...baseFilter, dateRange: badRange } }))
					.withContext('query with bad range should reject')
					.toBeRejected(),
				expectAsync(subscribeToOneExplorerSearch(query, { filter: { ...baseFilter, dateRange: goodRange } }))
					.withContext('good query should resolve')
					.toBeResolved(),
				expectAsync(subscribeToOneExplorerSearch(query, { filter: { ...baseFilter, dateRange: badRange } }))
					.withContext('query with bad range should reject')
					.toBeRejected(),
				expectAsync(subscribeToOneExplorerSearch(query, { filter: { ...baseFilter, dateRange: badRange } }))
					.withContext('query with bad range should reject')
					.toBeRejected(),
			]);
		}),
		25000,
	);

	it(
		'Should send error over error$ when Last is less than First',
		integrationTest(async () => {
			const subscribeToOneExplorerSearch = makeSubscribeToOneExplorerSearch(TEST_BASE_API_CONTEXT);
			const query = `tag=${tag} chart`;

			// Use an invalid filter, where Last is less than First
			const filter: SearchFilter = { entriesOffset: { index: 1, count: -1 }, dateRange: { start, end } };

			const search = await subscribeToOneExplorerSearch(query, { filter });

			// Non-error observables should error
			await Promise.all([
				expectAsync(lastValueFrom(search.progress$)).withContext('progress$ should error').toBeRejected(),
				expectAsync(lastValueFrom(search.entries$)).withContext('entries$ should error').toBeRejected(),
				expectAsync(lastValueFrom(search.stats$)).withContext('stats$ should error').toBeRejected(),
				expectAsync(lastValueFrom(search.statsOverview$)).withContext('statsOverview$ should error').toBeRejected(),
				expectAsync(lastValueFrom(search.statsZoom$)).withContext('statsZoom$ should error').toBeRejected(),
			]);

			// errors$ should emit one item (the error) and resolve
			const error = await lastValueFrom(search.errors$);

			expect(error).toBeDefined();
			expect(error.name.length).toBeGreaterThan(0);
			expect(error.message.length).toBeGreaterThan(0);
		}),
		25000,
	);

	xit(
		'Should work with queries using the raw renderer and preview flag',
		integrationTest(async () => {
			const subscribeToOneExplorerSearch = makeSubscribeToOneExplorerSearch(TEST_BASE_API_CONTEXT);
			const query = `tag=${tag} json value timestamp | raw`;
			const filter: SearchFilter = {
				entriesOffset: { index: 0, count: count },
				dateRange: 'preview',
			};
			const search = await subscribeToOneExplorerSearch(query, { filter });

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
				.withContext('The number of entries should be less than the total ingested for preview mode')
				.toBeLessThan(count);
			expect(textEntries.data.length).withContext('The number of entries should be more than zero').toBeGreaterThan(0);

			// Concat first because .reverse modifies the array
			const reversedData = originalData.concat().reverse();

			// Zip the results with the orignal, slicing the original to the length of the results, since
			// the preview flag limits the number of results we get back
			const trimmedOriginal = reversedData.slice(0, textEntries.data.length);
			expect(trimmedOriginal.length)
				.withContext('Lengths should match (sanity check)')
				.toEqual(textEntries.data.length);

			expect(
				zip(trimmedOriginal.slice(0, trimmedOriginal.length - 1), trimmedOriginal.slice(1)).reduce(
					(isDesc, [prev, cur]) => {
						if (prev === undefined || cur === undefined) {
							throw new Error('Zipped values were not the same length.');
						}
						return prev.value.foo > cur.value.foo && isDesc;
					},
					true,
				),
			)
				.withContext('original (trimmed and reversed) data should have values in descending order')
				.toBeTrue();

			expect(
				zip(textEntries.data.slice(0, textEntries.data.length - 1), textEntries.data.slice(1)).reduce(
					(isDesc, [prevEntry, curEntry]) => {
						if (prevEntry === undefined || curEntry === undefined) {
							throw new Error('Zipped values were not the same length.');
						}
						const prevValue: Entry = JSON.parse(base64.decode(prevEntry.data));
						const curValue: Entry = JSON.parse(base64.decode(curEntry.data));

						return prevValue.value.foo > curValue.value.foo && isDesc;
					},
					true,
				),
			)
				.withContext('received entry data should have values in descending order')
				.toBeTrue();

			zip(textEntries.data, trimmedOriginal).forEach(([entry, original], index) => {
				if (isUndefined(entry) || isUndefined(original)) {
					fail("All data should be defined, since we've sliced the original data to match the preview results");
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

				expect(_value)
					.withContext(`Each entry should have an enumerated value called "value"`)
					.toEqual({
						isEnumerated: true,
						name: 'value',
						value: JSON.stringify(original.value),
					});

				expect(value.value)
					.withContext('Each value should match its index, descending')
					.toEqual({ foo: count - index - 1 });
			});

			////
			// Check stats
			////
			expect(stats.length).toBeGreaterThan(0);

			expect(sum(statsOverview.frequencyStats.map(x => x.count)))
				.withContext(
					'The sum of counts from statsOverview should be less than the total count ingested in preview mode',
				)
				.toBeLessThan(count);
			// TODO include this test when backend is ready
			// expect(sum(statsOverview.frequencyStats.map(x => x.count)))
			// 	.withContext('The sum of counts from statsOverview should equal the number of results returned by preview mode')
			// 	.toEqual(textEntries.data.length);
			expect(sum(statsZoom.frequencyStats.map(x => x.count)))
				.withContext('The sum of counts from statsZoom should be less than the total count ingested in preview mode')
				.toBeLessThan(count);
			// TODO include this test when backend is ready
			// expect(sum(statsZoom.frequencyStats.map(x => x.count)))
			// 	.withContext('The sum of counts from statsZoom should equal the number of results returned by preview mode')
			// 	.toEqual(textEntries.data.length);

			// See if we can change the date range
			const lastEntriesP = lastValueFrom(
				search.entries$.pipe(
					takeWhile(e => datesAreEqual(e.start, start) === false, true),
					last(),
				),
			);
			search.setFilter({ dateRange: { start, end } });
			const lastEntries = await lastEntriesP;

			expect(datesAreEqual(lastEntries.start, start))
				.withContext(`Start date should be the one we just set`)
				.toBeTrue();
			expect(datesAreEqual(lastEntries.end, end)).withContext(`End date should be the one we just set`).toBeTrue();
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
				createSearch: async (initialFilter: SearchFilter): Promise<SearchSubscription> => {
					const subscribeToOneExplorerSearch = makeSubscribeToOneExplorerSearch(TEST_BASE_API_CONTEXT);

					const query = `tag=*`;

					return await subscribeToOneExplorerSearch(query, { filter: initialFilter });
				},
			}),
		),
		25000,
	);
});
