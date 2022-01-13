/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { LogLevel } from './log-level';
import { LOG_LEVEL_TO_RAW } from './log-level-to-raw';

export type RawLogLevel = typeof LOG_LEVEL_TO_RAW[LogLevel];
