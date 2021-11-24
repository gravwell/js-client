/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isKitArchive } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeDeleteOneKitArchive } from './delete-one-archive';
import { makeGetKitArchives } from './get-all-archives';

describe('deleteOneArchive()', () => {
	const getAllArchives = makeGetKitArchives(TEST_BASE_API_CONTEXT);
	const deleteOneArchive = makeDeleteOneKitArchive(TEST_BASE_API_CONTEXT);

	it(
		'Should delete an archive',
		integrationTest(async () => {
			const archives = await getAllArchives();
			if (archives.length > 0) {
				const deleted = await deleteOneArchive(archives[0].id);
				expect(deleted).toBeTrue();
			}
		}),
	);
});
