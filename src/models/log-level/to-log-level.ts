/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { LogLevel } from './log-level';
import { LOG_LEVEL_TO_RAW } from './log-level-to-raw';
import { RawLogLevel } from './raw-log-level';

const LOG_LEVEL_FROM_RAW: Record<RawLogLevel, LogLevel> = Object.entries(LOG_LEVEL_TO_RAW)
	.map(([logLevel, raw]) => ({ logLevel: logLevel as LogLevel, raw }))
	.reduce((acc, { logLevel, raw }) => {
		acc[raw] = logLevel;
		return acc;
	}, {} as Record<RawLogLevel, LogLevel>);

export const toLogLevel = (rawLogLevel: RawLogLevel): LogLevel => LOG_LEVEL_FROM_RAW[rawLogLevel];
