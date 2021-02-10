/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { addMinutes } from 'date-fns';
import { isArray } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { makeCreateOneAutoExtractor } from '~/functions/auto-extractors';
import { integrationTest, sleep, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeIngestMultiLineEntry } from '../../ingestors/ingest-multi-line-entry';
import { makeGetAllTags } from '../../tags/get-all-tags';
import { makeExploreOneTag } from './explore-one-tag';

interface Entry {
	timestamp: string;
	value: { foo: number };
}

describe('exploreOneTag()', () => {
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
			const value: Entry = { timestamp: addMinutes(start, i).toISOString(), value: { foo: i } };
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
			parameters: 'value value.foo',
		});
	}, 25000);

	it(
		'Should return data explorer entries',
		integrationTest(async () => {
			const exploreOneTag = makeExploreOneTag(TEST_BASE_API_CONTEXT);
			const explorerElements = await exploreOneTag(tag, { range: [start, end] });

			expect(isArray(explorerElements)).toBeTrue();

			// console.log(
			// 	'explore',
			// 	explorerElements.map(e => e.Elements![1].SubElements),
			// );
		}),
	);
});
