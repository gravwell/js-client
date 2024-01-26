/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { MailServerConfig } from '~/models/mail-server/mail-server-config';
import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { integrationTest } from '~/tests/test-types';
import { makeUpdateConfig } from './update-config';

describe('makeUpdateConfig()', () => {
	it(
		'Should update the mail server config',
		integrationTest(async () => {
			const updateConfig = makeUpdateConfig(await TEST_BASE_API_CONTEXT());
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
