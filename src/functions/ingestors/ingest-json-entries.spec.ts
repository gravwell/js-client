/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeIngestJSONEntries } from './ingest-json-entries';

describe('ingestJSONEntries()', () => {
	const ingestJSONEntries = makeIngestJSONEntries(TEST_BASE_API_CONTEXT);

	xit(
		'Should ingest the JSON entries',
		integrationTest(async () => {
			const entriesIngestedCount = await ingestJSONEntries([
				{ tag: 'custom-test', data: 'Text with 👻 emojis' },
				{ tag: 'custom-test', data: 'This is utf8 赤ちゃん' },
			]);
			expect(entriesIngestedCount).toBe(2);
		}),
	);
});
