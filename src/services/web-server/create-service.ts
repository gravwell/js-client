/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { APIContext } from '~/functions/utils';
import { makeRestartWebServer, makeWebServerIsDistributed } from '~/functions/web-server';
import { WebServerService } from './service';

export const createWebServerService = (context: APIContext): WebServerService => ({
	restart: makeRestartWebServer(context),

	is: {
		distributed: makeWebServerIsDistributed(context),
	},
});
