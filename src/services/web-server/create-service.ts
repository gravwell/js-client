/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { APIContext } from '~/functions/utils/api-context';
import { makeRestartWebServer } from '~/functions/web-server/restart-web-server';
import { makeWebServerIsDistributed } from '~/functions/web-server/web-server-is-distributed';
import { WebServerService } from './service';

export const createWebServerService = (context: APIContext): WebServerService => ({
	restart: makeRestartWebServer(context),

	is: {
		distributed: makeWebServerIsDistributed(context),
	},
});
