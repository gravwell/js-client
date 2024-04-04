/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { number, object, Verifier } from '~/functions/utils/verifiers';
import { NumericID, UUID } from '~/value-objects/id';

export interface ScheduledQueryData {
	id: NumericID;
	globalID: UUID;

	userID: NumericID;
	groupIDs: Array<NumericID>;
	isGlobal: boolean;

	name: string;
	description: string;
	labels: Array<string>;

	oneShot: boolean;
	isDisabled: boolean;

	lastUpdateDate: Date;
	lastRun: null | {
		date: Date;
		duration: number;
	};

	lastSearchIDs: null | Array<NumericID>;
	lastError: string | null;

	schedule: string;
	timezone: string | null;

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

	can: {
		delete: boolean;
		modify: boolean;
		share: boolean;
	};

	WriteAccess: {
		Global: boolean;
		GIDs: Array<NumericID>;
	};
}

export type ScheduledQueryDuration = {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
};

export const scheduledQueryDurationDecoder: Verifier<ScheduledQueryDuration> = object({
	days: number,
	hours: number,
	minutes: number,
	seconds: number,
});

export const isScheduledQueryDuration = scheduledQueryDurationDecoder.guard;
