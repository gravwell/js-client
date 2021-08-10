/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneLog } from './create-one-log';

describe('createOneLog()', () => {
	const createOneLog = makeCreateOneLog(TEST_BASE_API_CONTEXT);

	it(
		'Should create a log',
		integrationTest(async () => {
			await createOneLog('information', 'log test');
		}),
	);
});
