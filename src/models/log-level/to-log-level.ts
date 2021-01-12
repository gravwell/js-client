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

export const toLogLevel = (rawLogLevel: RawLogLevel): LogLevel => {
	const pair = Object.entries(LOG_LEVEL_TO_RAW).find(([, rawLevel]) => rawLevel === rawLogLevel);
	const [level] = pair;
	return <LogLevel>level;
};
