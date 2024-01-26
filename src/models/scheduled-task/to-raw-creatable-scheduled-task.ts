/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { ScheduledQueryDuration } from '~/models/scheduled-task/scheduled-query-data';
import { toRawNumericID } from '~/value-objects/id';
import { CreatableScheduledTask } from './creatable-scheduled-task';
import { RawCreatableScheduledTask } from './raw-creatable-scheduled-task';

export const toRawCreatableScheduledTask = (data: CreatableScheduledTask): RawCreatableScheduledTask => {
	const base: Omit<RawCreatableScheduledTask, 'DebugMode'> = {
		Groups: (data.groupIDs ?? []).map(toRawNumericID),
		Global: data.isGlobal ?? false,

		Name: data.name,
		Description: data.description,
		Labels: data.labels ?? [],

		OneShot: data.oneShot ?? false,
		Disabled: data.isDisabled ?? false,

		Schedule: data.schedule,
		Timezone: data.timezone ?? '',
	};

	switch (data.type) {
		case 'query':
			return {
				...base,
				SearchString: data.query,
				Duration: -Math.abs(data.searchSince.secondsAgo ?? 0),
				SearchSinceLastRun: data.searchSince.lastRun ?? false,
				DebugMode: false,
				TimeframeOffset: Math.abs(durationToSeconds(data.timeframeOffset)) * -1,
				BackfillEnabled: data.backfillEnabled,
				SearchReference: data.searchReference,
			};
		case 'script':
			return {
				...base,
				Script: data.script,
				DebugMode: data.isDebugging ?? false,
			};
	}
};

export const durationToSeconds = (value: ScheduledQueryDuration): number =>
	// TODO: year, months, weeks
	(value.days ?? 0) * 24 * 60 * 60 + (value.hours ?? 0) * 60 * 60 + (value.minutes ?? 0) * 60 + (value.seconds ?? 0);
