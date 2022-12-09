/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneLog } from './create-one-log';

describe('createOneLog()', () => {
	let createOneLog: ReturnType<typeof makeCreateOneLog>;
	beforeAll(async () => {
		createOneLog = makeCreateOneLog(await TEST_BASE_API_CONTEXT());
	});

	it(
		'Should create a log',
		integrationTest(async () => {
			await createOneLog('information', 'log test');
		}),
	);
});
