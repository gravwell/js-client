/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { omitUndefinedShallow } from '~/functions/utils/omit-undefined-shallow';
import { ScheduledQueryDuration } from '~/models/scheduled-task/scheduled-query-data';
import { toRawNumericID } from '~/value-objects/id';
import { CreatableScheduledTask } from './creatable-scheduled-task';
import { RawCreatableScheduledTask } from './raw-creatable-scheduled-task';

export const toRawCreatableScheduledTask = (data: CreatableScheduledTask): RawCreatableScheduledTask => {
	const base = {
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
			return omitUndefinedShallow({
				...base,
				SearchString: data.query,
				Duration: -Math.abs(data.searchSince.secondsAgo ?? 0),
				SearchSinceLastRun: data.searchSince.lastRun ?? false,
				DebugMode: false,
				TimeframeOffset: Math.abs(durationToSeconds(data.timeframeOffset)) * -1,
				BackfillEnabled: data.backfillEnabled,
				SearchReference: data.searchReference,
				Global: data.isGlobal ?? false,
				Groups: (data.groupIDs ?? []).map(toRawNumericID),
				WriteAccess: {
					Global: data.WriteAccess.Global,
					GIDs: data.WriteAccess.GIDs.map(toRawNumericID),
				},
			});
		case 'script':
			return {
				...base,
				Groups: (data.groupIDs ?? []).map(toRawNumericID),
				Global: data.isGlobal ?? false,
				Script: data.script,
				DebugMode: data.isDebugging ?? false,
				WriteAccess: {
					Global: false,
					GIDs: [],
				},
			};
	}
};

export const durationToSeconds = (value: ScheduledQueryDuration): number =>
	// TODO: year, months, weeks
	(value.days ?? 0) * 24 * 60 * 60 + (value.hours ?? 0) * 60 * 60 + (value.minutes ?? 0) * 60 + (value.seconds ?? 0);
