/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isString } from 'lodash';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeGetAllAutoExtractorModules } from './get-all-auto-extractor-modules';

describe('getAllAutoExtractorModules()', () => {
	const getAllAutoExtractorModules = makeGetAllAutoExtractorModules({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
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
