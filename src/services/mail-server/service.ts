/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { MailServerTestResult } from '~/models/mail-server/mail-server-test-result';
import { MailServerConfig, MailServerTestData } from '../../models';

export interface MailServerService {
	get: {
		config: () => Promise<Omit<MailServerConfig, 'password'>>;
	};
	update: {
		config: (config: MailServerConfig) => Promise<boolean>;
	};
	create: {
		test: (data: MailServerTestData) => Promise<MailServerTestResult>;
	};
}
