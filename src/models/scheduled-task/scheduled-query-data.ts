/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { ScheduledTaskBase } from './scheduled-task-base';

export interface ScheduledQueryData extends ScheduledTaskBase {
	type: 'query';
	query: string;
	timeframeOffset: ScheduledQueryDuration;
	backfillEnabled: boolean;
	searchSince: {
		lastRun: boolean;
		/** Always negative and in seconds */
		secondsAgo: number; // It's the same as `raw.Duration`
	};
	searchReference?: string | undefined; // UUID of query library item.
}

export type ScheduledQueryDuration = {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
};
