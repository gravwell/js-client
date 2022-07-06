/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNil } from 'lodash';
import { DATA_TYPE } from '~/models';
import { RawScheduledTask } from './raw-scheduled-task';
import { ScheduledTask, ScheduledTaskType } from './scheduled-task';
import { toScheduledTaskBase } from './to-scheduled-task-base';

export const toScheduledTask = (raw: RawScheduledTask): ScheduledTask => {
	const base = toScheduledTaskBase(raw);
	const type: ScheduledTaskType = getScheduledTaskType(raw);

	switch (type) {
		case 'query':
			return {
				...base,
				_tag: DATA_TYPE.SCHEDULED_QUERY,
				type,
				query: raw.SearchString,
				searchSince: {
					lastRun: raw.SearchSinceLastRun,
					secondsAgo: Math.abs(raw.Duration),
				},
			};
		case 'script':
			return {
				...base,
				_tag: DATA_TYPE.SCHEDULED_SCRIPT,
				type,
				script: raw.Script,
				isDebugging: raw.DebugMode,
				debugOutput: raw.DebugOutput,
			};
	}
};

export const getScheduledTaskType = <T extends { Script?: string; SearchString?: string }>(
	raw: T,
): ScheduledTask['type'] => {
	if (isNil(raw.Script)) return 'query';
	if (raw.Script.trim() !== '') return 'script';
	// From the [docs](https://docs.gravwell.io/#!api/scheduledsearches.md#Creating_a_scheduled_search):
	// If both (Script and SearchString) are populated, the script will take precedence.
	return (raw.SearchString ?? '').trim() === '' ? 'script' : 'query';
};
