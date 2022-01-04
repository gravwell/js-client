/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isIndexerWell } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeGetAllIndexers } from './get-all-indexers';

describe('getAllIndexers()', () => {
	const getAllIndexers = makeGetAllIndexers(TEST_BASE_API_CONTEXT);

	it(
		'Should return all IndexerWells',
		integrationTest(async () => {
			const indexers = await getAllIndexers();

			expect(indexers.every(isIndexerWell)).toBeTrue();
		}),
	);
});
