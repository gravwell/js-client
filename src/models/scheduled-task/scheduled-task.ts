/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { ScheduledQuery } from './scheduled-query';
import { ScheduledScript } from './scheduled-script';

export type ScheduledTask = ScheduledQuery | ScheduledScript;
export type ScheduledTaskType = ScheduledTask['type'];
