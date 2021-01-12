/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ScheduledTaskBase } from './scheduled-task-base';

export interface ScheduledQuery extends ScheduledTaskBase {
	type: 'query';
	query: string;
	searchSince: { lastRun: boolean; secondsAgo: number };
}