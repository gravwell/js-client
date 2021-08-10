/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawLogLevel } from './raw-log-level';

export interface RawLogLevels {
	Current: RawLogLevel | 'Off';
	Levels: Array<RawLogLevel | 'Off'>;
}
