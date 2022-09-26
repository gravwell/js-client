/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isKitArchive } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeGetKitArchives } from './get-all-archives';

describe('getAllArchives()', () => {
	let getAllArchives: ReturnType<typeof makeGetKitArchives>;
	beforeAll(async () => {
		getAllArchives = makeGetKitArchives(await TEST_BASE_API_CONTEXT());
	});

	it(
		'Should return all kit archives in the system',
		integrationTest(async () => {
			const archives = await getAllArchives();
			expect(archives.every(isKitArchive)).toBeTrue();
		}),
	);
});
