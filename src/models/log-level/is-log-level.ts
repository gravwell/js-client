/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { LogLevel } from './log-level';
import { LOG_LEVEL_TO_RAW } from './log-level-to-raw';

export const isLogLevel = (value: any): value is LogLevel => {
	if (typeof value !== 'string') {
		return false;
	}
	const logLevels = Object.keys(LOG_LEVEL_TO_RAW) as Array<LogLevel>;
	return logLevels.includes(value as LogLevel);
};
