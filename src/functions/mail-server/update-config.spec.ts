/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isMailServerConfig, MailServerConfig } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeUpdateConfig } from './update-config';

describe('makeUpdateConfig()', () => {
	it(
		'Should update the mail server config',
		integrationTest(async () => {
			const updateConfig = makeUpdateConfig(TEST_BASE_API_CONTEXT);
			const config: MailServerConfig = {
				server: 'dev@gravwell.io',
				insecureSkipVerify: true,
				password: 'booboo',
				port: 25,
				useTLS: true,
				username: 'devtema',
			};

			const created = await updateConfig(config);
			expect(created).toBeTrue();
		}),
	);
});
