/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeCreateOneLog } from '~/functions/logs/create-one-log';
import { makeGetLogLevels } from '~/functions/logs/get-log-levels';
import { makeSetLogLevel } from '~/functions/logs/set-log-level';
import { APIContext } from '~/functions/utils/api-context';
import { LogsService } from './service';

export const createLogsService = (context: APIContext): LogsService => ({
	get: {
		levels: makeGetLogLevels(context),
	},

	set: {
		level: makeSetLogLevel(context),
	},

	create: {
		one: makeCreateOneLog(context),
	},
});
