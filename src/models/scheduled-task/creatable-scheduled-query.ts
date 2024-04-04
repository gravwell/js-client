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

export interface CreatableScheduledQuery {
	groupIDs?: Array<NumericID>;
	isGlobal?: boolean;
	name: string;
	description: string;
	labels?: Array<string>;
	oneShot?: boolean;
	isDisabled?: boolean;
	schedule: string;
	timezone?: string | null;
	query?: string | undefined;
	searchSince: { lastRun?: boolean; secondsAgo: number };
	timeframeOffset: ScheduledQueryDuration;
	backfillEnabled: boolean;
	searchReference?: string | undefined; // UUID of query library item.
	WriteAccess: {
		Global: boolean;
		GIDs: Array<NumericID>;
	};
}
