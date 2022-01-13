/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { LogLevels } from './log-levels';
import { RawLogLevels } from './raw-log-levels';
import { toLogLevel } from './to-log-level';

export const toLogLevels = (raw: RawLogLevels): LogLevels => ({
	current: raw.Current === 'Off' ? 'off' : toLogLevel(raw.Current),
	available: raw.Levels.map(l => (l === 'Off' ? 'off' : toLogLevel(l))),
});
