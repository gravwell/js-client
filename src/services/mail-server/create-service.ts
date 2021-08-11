/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/
import {MailServerService} from './service';
import {APIContext} from '../../functions/utils';
import {makeGetConfig, makeCreateTest, makeUpdateConfig} from '../../functions/mail-server';

export const makeMailServerService = (context: APIContext): MailServerService => {
	return {
		get: {
			config: makeGetConfig(context),
		},
		update: {
			config: makeUpdateConfig(context),
		},
		create: {
			test: () => makeCreateTest(context),
		},
	}
}
