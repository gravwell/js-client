/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ScheduledScript } from './scheduled-script';
import { ScheduledQuery } from './squeduled-query';

export type ScheduledTask = ScheduledQuery | ScheduledScript;
export type ScheduledTaskType = ScheduledTask['type'];
