/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { LogLevel } from './log-level';

export interface LogLevels {
	current: LogLevel | 'off';
	available: Array<LogLevel | 'off'>;
}
