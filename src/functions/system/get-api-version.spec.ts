/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isVersion } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeGetAPIVersion } from './get-api-version';

describe('getAPIVersion()', () => {
	const getAPIVersion = makeGetAPIVersion({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });

	it(
		'Should get the API version',
		integrationTest(async () => {
			const { api, build } = await getAPIVersion();
			expect(isVersion(api)).toBeTrue();
			expect(isVersion(build)).toBeTrue();
		}),
	);
});
