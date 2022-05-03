/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { MailServerConfig, MailServerTestData } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateServerTest } from './create-server-test';
import { makeUpdateConfig } from './update-config';

describe('makeCreateServerTest()', () => {
	const updateMailServerConfig = makeUpdateConfig(TEST_BASE_API_CONTEXT);
	const createServerTest = makeCreateServerTest(TEST_BASE_API_CONTEXT);

	it(
		'Should enqueue an email when mail server config is set',
		integrationTest(async () => {
			const config: MailServerConfig = {
				server: 'localhost',
				username: 'dev',
				port: 32,
				password: 'pwd',
				insecureSkipVerify: true,
				useTLS: false,
			};
			// update/create config in case one doesn't exist in the backend yet
			const result = await updateMailServerConfig(config);
			expect(result).toBe(true);

			const data: MailServerTestData = {
				from: 'someone@localhost',
				to: 'someone@localhost',
				body: 'This is a test',
				subject: 'This is a subject',
			};
			const testResult = await createServerTest(data);
			expect(['enqueued', 'success']).toContain(testResult);
		}),
	);
});
