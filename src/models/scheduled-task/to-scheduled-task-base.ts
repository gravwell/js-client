/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

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
	lastRunDate: new Date(raw.LastRun),

	lastSearchIDs: raw.LastSearchIDs,
	lastRunDuration: raw.LastRunDuration,
	lastError: raw.LastError.trim() === '' ? null : raw.LastError,

	schedule: raw.Schedule,
	timezone: raw.Timezone.trim() === '' ? null : raw.Timezone,
});
