/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { ScheduledQueryDuration } from '~/models/scheduled-task/scheduled-query-data';
import { UpdatableScheduledTaskBase } from './updatable-scheduled-task-base';

export type UpdatableScheduledTask = TaggedUpdatableScheduledQuery | TaggedUpdatableScheduledScript;

export interface UpdatableScheduledQuery extends UpdatableScheduledTaskBase {
	query?: string;
	searchSince?: { lastRun?: boolean; secondsAgo: number };
	timeframeOffset?: ScheduledQueryDuration;
	backfillEnabled?: boolean;
}

export interface UpdatableScheduledScript extends UpdatableScheduledTaskBase {
	script?: string;
	isDebugging?: boolean;
}

export interface TaggedUpdatableScheduledQuery extends UpdatableScheduledQuery {
	type?: 'query';
}

export interface TaggedUpdatableScheduledScript extends UpdatableScheduledScript {
	type?: 'script';
}
