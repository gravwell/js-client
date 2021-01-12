/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawScheduledTask } from './raw-scheduled-task';
import { ScheduledTask, ScheduledTaskType } from './scheduled-task';
import { toScheduledTaskBase } from './to-scheduled-task-base';

export const toScheduledTask = (raw: RawScheduledTask): ScheduledTask => {
	const base = toScheduledTaskBase(raw);
	// From the [docs](https://docs.gravwell.io/#!api/scheduledsearches.md#Creating_a_scheduled_search):
	// If both (Script and SearchString) are populated, the script will take precedence.
	const type: ScheduledTaskType = raw.Script.trim().length > 0 ? 'script' : 'query';

	switch (type) {
		case 'query':
			return {
				...base,
				type: 'query',
				query: raw.SearchString,
				searchSince: {
					lastRun: raw.SearchSinceLastRun,
					secondsAgo: Math.abs(raw.Duration),
				},
			};
		case 'script':
			return {
				...base,
				type: 'script',
				script: raw.Script,
				isDebugging: raw.DebugMode,
				debugOutput: raw.DebugOutput,
			};
	}
};
