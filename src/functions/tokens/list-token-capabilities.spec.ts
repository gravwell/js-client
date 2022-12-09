/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isTokenCapability } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeListTokenCapabilities } from './list-token-capabilities';

describe('listTokenCapabilities()', () => {
	let listTokenCapabilities: ReturnType<typeof makeListTokenCapabilities>;
	beforeAll(async () => {
		listTokenCapabilities = makeListTokenCapabilities(await TEST_BASE_API_CONTEXT());
	});

	it(
		'Should returns all token capabilities',
		integrationTest(async () => {
			const tokensCapabilities = await listTokenCapabilities();
			const areTokenCapabilities = tokensCapabilities.every(isTokenCapability);
			expect(areTokenCapabilities).toBeTrue();
		}),
	);
});
