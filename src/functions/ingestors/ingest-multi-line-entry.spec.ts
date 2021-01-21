/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest } from '../../tests';
import { TEST_BASE_API_CONTEXT } from '../../tests/config';
import { makeIngestMultiLineEntry } from './ingest-multi-line-entry';

describe('ingestMultiLineEntry()', () => {
	const ingestMultiLineEntry = makeIngestMultiLineEntry(TEST_BASE_API_CONTEXT);

	it(
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
