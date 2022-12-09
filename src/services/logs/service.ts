/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { LogLevel, LogLevels } from '~/models/log-level';

export interface LogsService {
	readonly get: {
		readonly levels: () => Promise<LogLevels>;
	};

	readonly set: {
		readonly level: (level: LogLevel | 'off') => Promise<void>;
	};

	readonly create: {
		readonly one: (level: LogLevel, message: string) => Promise<void>;
	};
}
