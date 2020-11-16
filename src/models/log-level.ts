/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

const LOG_LEVEL_TO_RAW = {
	'error': 'Error',
	'warning': 'Warn',
	'information': 'Info',
	'web access': 'Web Access',
} as const;

export type LogLevel = keyof typeof LOG_LEVEL_TO_RAW;
export type RawLogLevel = typeof LOG_LEVEL_TO_RAW[LogLevel];

export const toRawLogLevel = (logLevel: LogLevel): RawLogLevel => LOG_LEVEL_TO_RAW[logLevel];

export const toLogLevel = (rawLogLevel: RawLogLevel): LogLevel => {
	const pair = Object.entries(LOG_LEVEL_TO_RAW).find(([, rawLevel]) => rawLevel === rawLogLevel);
	const [level] = pair;
	return <LogLevel>level;
};

export const isValidLogLevel = (value: any): value is LogLevel => {
	if (typeof value !== 'string') return false;
	const logLevels = Object.keys(LOG_LEVEL_TO_RAW) as Array<LogLevel>;
	return logLevels.includes(<LogLevel>value);
};
