/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isLocalKit } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeGetAllLocalKits } from './get-all-local-kits';

describe('getAllLocalKits()', () => {
	let getAllLocalKits: ReturnType<typeof makeGetAllLocalKits>;
	beforeAll(async () => {
		getAllLocalKits = makeGetAllLocalKits(await TEST_BASE_API_CONTEXT());
	});

	it(
		'Should return all kits in the system',
		integrationTest(async () => {
			const kits = await getAllLocalKits();
			expect(kits.every(isLocalKit)).toBeTrue();
		}),
	);
});
