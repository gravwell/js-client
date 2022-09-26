/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isArray } from 'lodash';
import { toNumericID } from '~/value-objects';
import { RawScheduledTask } from './raw-scheduled-task';
import { ScheduledTaskBase } from './scheduled-task-base';

export const toScheduledTaskBase = (raw: RawScheduledTask): ScheduledTaskBase => ({
	id: toNumericID(raw.ID),
	globalID: raw.GUID,

	userID: toNumericID(raw.Owner),
	groupIDs: raw.Groups?.map(toNumericID) ?? [],
	isGlobal: raw.Global ?? false,

	name: raw.Name,
	description: raw.Description,
	labels: raw.Labels ?? [],

	oneShot: raw.OneShot,
	isDisabled: raw.Disabled,

	lastUpdateDate: new Date(raw.Updated),
	lastRun: isLastRunNull(raw.LastRun)
		? null
		: {
				date: new Date(raw.LastRun),
				duration: raw.LastRunDuration,
		  },

	lastSearchIDs: isArray(raw.LastSearchIDs) ? raw.LastSearchIDs.map(id => id.toString()) : null,
	lastError: raw.LastError.trim() === '' ? null : raw.LastError,

	schedule: raw.Schedule,
	timezone: raw.Timezone.trim() === '' ? null : raw.Timezone,
});

/* "0001-01-01T00:00:00Z" is the value that the backend returns when the ScheduledSearch hasn't ever been run */
const NULL_DATE = '0001-01-01T00:00:00Z';
export const isLastRunNull = (lastRun: string): boolean => lastRun === NULL_DATE;
