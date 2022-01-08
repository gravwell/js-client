/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { omit } from 'lodash';
import { MailServerConfig } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeGetConfig } from './get-config';
import { makeUpdateConfig } from './update-config';

describe('getMailServerConfig()', () => {
	it(
		'Should return the mail server config',
		integrationTest(async () => {
			const getMailServerConfig = makeGetConfig(TEST_BASE_API_CONTEXT);
			const updateMailServerConfig = makeUpdateConfig(TEST_BASE_API_CONTEXT);

			const config: MailServerConfig = {
				server: 'localhost',
				username: 'dev',
				port: 32,
				password: 'pwd',
				insecureSkipVerify: true,
				useTLS: false,
			};
			// update/create config
			const result = await updateMailServerConfig(config);
			expect(result).toBe(true);

			const createdConfig = await getMailServerConfig();
			// api doesn't return password on get so we omit it
			expect(createdConfig).toEqual(omit(config, 'password'));
		}),
	);
});
