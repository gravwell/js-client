/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeCreateOneLog } from './create-one-log';

describe('createOneLog()', () => {
	const createOneLog = makeCreateOneLog({ host: TEST_HOST, useEncryption: false });

	it(
		'Should create a log',
		integrationTest(async () => {
			await createOneLog(TEST_AUTH_TOKEN, 'information', 'log test');
		}),
	);
});
