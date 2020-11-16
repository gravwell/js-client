/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeIngestMultiLineEntry } from './ingest-multi-line-entry';

describe('ingestMultiLineEntry()', () => {
	const ingestMultiLineEntry = makeIngestMultiLineEntry({ host: TEST_HOST, useEncryption: false });

	it(
		'Should ingest the file entry',
		integrationTest(async () => {
			const entriesIngestedCount = await ingestMultiLineEntry(TEST_AUTH_TOKEN, {
				tag: 'custom-test',
				data: 'This is\na file\nwith three lines',
			});
			expect(entriesIngestedCount).toBe(3);
		}),
	);
});
