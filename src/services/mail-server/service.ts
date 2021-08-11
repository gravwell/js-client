/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {MailServerConfig} from '../../models/mail-server';

export interface MailServerService {
	get: {
		config: () => Promise<MailServerConfig>,
	},
	update: {
		config: (config: MailServerConfig) => Promise<MailServerConfig>,
	},
	create: {
		test: () => Promise<void>,
	},
}
