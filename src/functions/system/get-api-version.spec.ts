/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isVersion } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeGetAPIVersion } from './get-api-version';

describe('getAPIVersion()', () => {
	const getAPIVersion = makeGetAPIVersion(TEST_BASE_API_CONTEXT);

	it(
		'Should get the API version',
		integrationTest(async () => {
			const { api, build } = await getAPIVersion();
			expect(isVersion(api)).toBeTrue();
			expect(isVersion(build)).toBeTrue();
		}),
	);
});
