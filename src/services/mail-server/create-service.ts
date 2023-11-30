/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */
import { makeCreateServerTest } from '../../functions/mail-server/create-server-test';
import { makeGetConfig } from '../../functions/mail-server/get-config';
import { makeUpdateConfig } from '../../functions/mail-server/update-config';
import { APIContext } from '../../functions/utils/api-context';
import { MailServerService } from './service';

export const createMailServerService = (context: APIContext): MailServerService => ({
	get: {
		config: makeGetConfig(context),
	},
	update: {
		config: makeUpdateConfig(context),
	},
	create: {
		test: makeCreateServerTest(context),
	},
});
