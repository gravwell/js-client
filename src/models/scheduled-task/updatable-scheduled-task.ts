/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { ScheduledQueryDuration } from '~/models/scheduled-task/scheduled-query-data';
import { NumericID } from '~/value-objects/id';
import { UpdatableScheduledTaskBase } from './updatable-scheduled-task-base';

export type UpdatableScheduledTask = TaggedUpdatableScheduledQuery | TaggedUpdatableScheduledScript;

export interface UpdatableScheduledQuery {
	id: NumericID;
	groupIDs?: Array<NumericID>;
	isGlobal?: boolean;
	name?: string;
	description?: string;
	labels?: Array<string>;
	oneShot?: boolean;
	isDisabled?: boolean;
	schedule?: string;
	timezone?: string | null;
	query?: string;
	searchSince?: { lastRun?: boolean; secondsAgo: number };
	timeframeOffset?: ScheduledQueryDuration;
	backfillEnabled?: boolean;
	searchReference?: string | undefined; // UUID of query library item.
	WriteAccess?: {
		Global: boolean;
		GIDs: Array<NumericID>;
	};
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
