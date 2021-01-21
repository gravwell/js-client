/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeIngestJSONEntries } from './ingest-json-entries';

describe('ingestJSONEntries()', () => {
	const ingestJSONEntries = makeIngestJSONEntries({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});

	it(
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
