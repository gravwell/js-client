/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { addMinutes } from 'date-fns';
import { random, sample } from 'lodash';
import { lastValueFrom } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import {
	HexSearchEntries,
	PcapSearchEntries,
	PointToPointSearchEntries,
	StackGraphSearchEntries,
} from '~/models/search/search-entries';
import { SearchFilter } from '~/models/search/search-filter';
import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { myCustomMatchers } from '~/tests/custom-matchers';
import { integrationTestSpecDef } from '~/tests/test-types';
import { sleep } from '~/tests/utils';
import { makeIngestMultiLineEntry } from '../ingestors/ingest-multi-line-entry';
import { makeGetAllTags } from '../tags/get-all-tags';
import { makeSubscribeToOneSearch } from './subscribe-to-one-search/subscribe-to-one-search';

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

xdescribe(
	'search renderer types',
	integrationTestSpecDef(() => {
		// Make function to subscript to a search
		let subscribeToOneSearch: ReturnType<typeof makeSubscribeToOneSearch>;
		beforeAll(async () => {
			subscribeToOneSearch = makeSubscribeToOneSearch(await TEST_BASE_API_CONTEXT());
		});

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
			const ingestMultiLineEntry = makeIngestMultiLineEntry(await TEST_BASE_API_CONTEXT());
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
			const getAllTags = makeGetAllTags(await TEST_BASE_API_CONTEXT());
			while (!(await getAllTags()).includes(tag)) {
				// Give the backend a moment to catch up
				await sleep(1000);
			}
			await sleep(5000);
		}, 25000);

		it('should search using the point2point renderer', async () => {
			// Perform a query, rendering it as point2point
			const query = `tag=${tag} json srclocation.lat as slat srclocation.lon as slon dstlocation.lat as dlat dstlocation.lon as dlon | point2point -srclat slat -srclong slon -dstlat dlat -dstlong dlon`;
			const filter: SearchFilter = { entriesOffset: { index: 0, count }, dateRange: { start, end } };
			const search = await subscribeToOneSearch(query, { filter });

			// Wait on the entries to come back
			const entries = await lastValueFrom(search.entries$.pipe(takeWhile(e => !e.finished, true)));

			// Check the type
			expect(entries.type).toEqual('point2point');

			// Assert type and make some basic sanity checks
			const point2PointEntries = entries as PointToPointSearchEntries;
			expect(point2PointEntries.finished).toBeTrue();
			expect(point2PointEntries.data.length).toEqual(count);
		}, 25000);

		it('should work with queries using the hex renderer, which behaves like the raw renderer', async () => {
			// Perform a query, rendering it as hex
			const query = `tag=${tag} hex`;
			const filter: SearchFilter = { entriesOffset: { index: 0, count }, dateRange: { start, end } };
			const search = await subscribeToOneSearch(query, { filter });

			// Wait on the entries to come back
			const entries = await lastValueFrom(search.entries$.pipe(takeWhile(e => !e.finished, true)));

			// Check the type
			expect(entries.type).toEqual('hex');

			// Assert type and make some basic sanity checks
			const hexEntries = entries as HexSearchEntries;
			expect(hexEntries.finished).toBeTrue();
			expect(hexEntries.data.length).toEqual(count);
		}, 25000);

		it('should work with queries using the pcap renderer, which behaves like the text renderer', async () => {
			// Perform a query, rendering it as pcap
			const query = `tag=${tag} pcap`;
			const filter: SearchFilter = { entriesOffset: { index: 0, count }, dateRange: { start, end } };
			const search = await subscribeToOneSearch(query, { filter });

			// Wait on the entries to come back
			const entries = await lastValueFrom(search.entries$.pipe(takeWhile(e => !e.finished, true)));

			// Check the type
			expect(entries.type).toEqual('pcap');

			// Assert type and make some basic sanity checks
			const pcapEntries = entries as PcapSearchEntries;
			expect(pcapEntries.finished).toBeTrue();
			expect(pcapEntries.data.length).toEqual(count);
		}, 25000);

		it('should work with queries using the stackgraph renderer', async () => {
			// Perform a query, rendering it as a stackgraph
			const query = `tag=${tag}  json category fixed value |  sum value by category,fixed | stackgraph category fixed sum`;
			const filter: SearchFilter = { dateRange: { start, end } };
			const search = await subscribeToOneSearch(query, { filter });

			// Wait on the entries to come back
			const entries = await lastValueFrom(search.entries$.pipe(takeWhile(e => !e.finished, true)));

			// Check the type
			expect(entries.type).toEqual('stackgraph');

			// Assert type and make some basic sanity checks
			const stackGraphEntries = entries as StackGraphSearchEntries;
			expect(stackGraphEntries.finished).toBeTrue();
			expect(stackGraphEntries.data.length).toEqual(3); // the three categories: red, green, blue
		}, 25000);
	}),
);
