/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { assertIsNotNil } from '../utils/type-guards';
import { makeDeleteOneKitArchive } from './delete-one-archive';
import { makeGetKitArchives } from './get-all-archives';

describe('deleteOneArchive()', () => {
	let getAllArchives: ReturnType<typeof makeGetKitArchives>;
	beforeAll(async () => {
		getAllArchives = makeGetKitArchives(await TEST_BASE_API_CONTEXT());
	});
	let deleteOneArchive: ReturnType<typeof makeDeleteOneKitArchive>;
	beforeAll(async () => {
		deleteOneArchive = makeDeleteOneKitArchive(await TEST_BASE_API_CONTEXT());
	});

	it(
		'Should delete an archive',
		integrationTest(async () => {
			const archives = await getAllArchives();
			const archive = archives[0];
			assertIsNotNil(archive);
			const deleted = await deleteOneArchive(archive.id);
			expect(deleted).toBeTrue();
		}),
	);
});