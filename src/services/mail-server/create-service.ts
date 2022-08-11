/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/
import { makeCreateServerTest, makeGetConfig, makeUpdateConfig } from '../../functions/mail-server';
import { APIContext } from '../../functions/utils';
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
