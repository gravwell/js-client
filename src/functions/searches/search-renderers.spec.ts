/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { addMinutes } from 'date-fns';
import { random, sample } from 'lodash';
import { last, map, takeWhile } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { PointToPointSearchEntries } from '~/models';
import { integrationTest, myCustomMatchers, sleep, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeIngestMultiLineEntry } from '../ingestors';
import { makeGetAllTags } from '../tags';
import { makeSubscribeToOneSearch } from './subscribe-to-one-search';

interface Coordinate {
	lon: number;
	lat: number;
}

interface Entry {
	category: 'red' | 'blue' | 'green';
	value: number;
	fixed: 10;
	ip: string;
	location: Coordinate;
	srclocation: Coordinate;
	dstlocation: Coordinate;
	timestamp: string;
}

const randomIp = (): string => {
	const octet = (): number => random(10, 200, false);
	return `${octet()}.${octet()}.${octet()}.${octet()}`;
};
const randomCoordinate = (): Coordinate => ({ lat: random(-85, 85), lon: random(-180, 180) });

describe('search renderer types', () => {
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
			const value: Entry = {
				category: sample<Entry['category']>(['red', 'blue', 'green']) ?? 'red',
				value: random(0, 100),
				fixed: 10,
				ip: randomIp(),
				location: randomCoordinate(),
				srclocation: randomCoordinate(),
				dstlocation: randomCoordinate(),
				timestamp: addMinutes(start, i).toISOString(),
			};
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
		await sleep(5000);
	}, 25000);

	it(
		'should search using the point2point renderer',
		integrationTest(async () => {
			const subscribeToOneSearch = makeSubscribeToOneSearch(TEST_BASE_API_CONTEXT);

			// Perform a query, rendering it as point2point
			const query = `tag=${tag} json srclocation.lat as slat srclocation.lon as slon dstlocation.lat as dlat dstlocation.lon as dlon | point2point -srclat slat -srclong slon -dstlat dlat -dstlong dlon`;
			const search = await subscribeToOneSearch(query, { filter: { dateRange: { start, end } } });

			// Wait for the entry count to come through
			const stats = await search.stats$
				.pipe(
					takeWhile(e => !e.finished, true),
					last(),
				)
				.toPromise();

			// Entry count should match
			expect(stats.entries).toEqual(count);

			// Set the count on the filter, so that we're getting **everything** back
			search.setFilter({ entriesOffset: { index: 0, count: stats.entries } });

			// Wait on the entries to come back
			const point2PointEntries = await search.entries$
				.pipe(
					map(e => e as PointToPointSearchEntries),
					takeWhile(e => !e.finished, true),
					last(),
				)
				.toPromise();

			// Assert that we got what we expected
			expect(point2PointEntries.finished).toBeTrue();
			expect(point2PointEntries.data.length).toEqual(count);
		}),
		25000,
	);
});
