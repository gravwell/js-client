/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isString } from 'lodash';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeGetAllAutoExtractorModules } from './get-all-auto-extractor-modules';

describe('getAllAutoExtractorModules()', () => {
	let getAllAutoExtractorModules: ReturnType<typeof makeGetAllAutoExtractorModules>;
	beforeAll(async () => {
		getAllAutoExtractorModules = makeGetAllAutoExtractorModules(await TEST_BASE_API_CONTEXT());
	});

	it(
		'Should return all auto extractors modules',
		integrationTest(async () => {
			const autoExtractorModules = await getAllAutoExtractorModules();
			expect(autoExtractorModules.every(isString)).toBeTrue();
			expect(autoExtractorModules.length).toBeGreaterThan(0);
		}),
	);
});
