/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isNil } from 'lodash';
import { DATA_TYPE } from '~/models/data-type';
import { ScheduledQueryDuration } from '~/models/scheduled-task/scheduled-query-data';
import { toNumericID } from '~/value-objects/id';
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
				timeframeOffset: secondsToDuration(Math.abs(raw.TimeframeOffset ?? 0)),
				backfillEnabled: raw.BackfillEnabled ?? false,
				searchReference: raw.SearchReference,
				can: {
					delete: raw.Can?.Delete ?? false,
					modify: raw.Can?.Modify ?? false,
					share: raw.Can?.Share ?? false,
				},
				isGlobal: raw.Global ?? false,
				groupIDs: raw.Groups?.map(toNumericID) ?? [],
				WriteAccess: {
					Global: raw.WriteAccess?.Global ?? false,
					GIDs: raw.WriteAccess?.GIDs?.map(toNumericID) ?? [],
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
	if (isNil(raw.Script)) {
		return 'query';
	}
	if (raw.Script.trim() !== '') {
		return 'script';
	}
	// From the [docs](https://docs.gravwell.io/#!api/scheduledsearches.md#Creating_a_scheduled_search):
	// If both (Script and SearchString) are populated, the script will take precedence.
	return (raw.SearchString ?? '').trim() === '' ? 'script' : 'query';
};

export const secondsToDuration = (totalSeconds: number): ScheduledQueryDuration => {
	const days = Math.floor(totalSeconds / (24 * 60 * 60));
	const hours = Math.floor((totalSeconds - days * 24 * 60 * 60) / (60 * 60));
	const minutes = Math.floor((totalSeconds - days * 24 * 60 * 60 - hours * 60 * 60) / 60);
	const seconds = Math.floor(totalSeconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60);
	return { days, hours, minutes, seconds };
};
