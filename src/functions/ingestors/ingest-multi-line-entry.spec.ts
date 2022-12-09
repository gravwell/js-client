/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeIngestMultiLineEntry } from './ingest-multi-line-entry';

describe('ingestMultiLineEntry()', () => {
	let ingestMultiLineEntry: ReturnType<typeof makeIngestMultiLineEntry>;
	beforeAll(async () => {
		ingestMultiLineEntry = makeIngestMultiLineEntry(await TEST_BASE_API_CONTEXT());
	});

	xit(
		'Should ingest the file entry',
		integrationTest(async () => {
			const entriesIngestedCount = await ingestMultiLineEntry({
				tag: 'custom-test',
				data: 'This is\na file\nwith three lines',
			});
			expect(entriesIngestedCount).toBe(3);
		}),
	);
});
