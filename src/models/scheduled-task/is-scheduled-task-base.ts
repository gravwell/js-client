/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isBoolean, isDate, isNull, isNumber, isString } from 'lodash';
import { isNumericID, isUUID } from '~/value-objects';
import { ScheduledTaskBase } from './scheduled-task-base';

export const isScheduledTaskBase = (value: unknown): value is ScheduledTaskBase => {
	try {
		const ss = value as ScheduledTaskBase;
		return (
			isNumericID(ss.id) &&
			isUUID(ss.globalID) &&
			isBoolean(ss.isGlobal) &&
			isNumericID(ss.userID) &&
			ss.groupIDs.every(isNumericID) &&
			isString(ss.name) &&
			isString(ss.description) &&
			ss.labels.every(isString) &&
			isBoolean(ss.oneShot) &&
			isBoolean(ss.isDisabled) &&
			isDate(ss.lastUpdateDate) &&
			(isNull(ss.lastRun) || (isDate(ss.lastRun.date) && isNumber(ss.lastRun.duration))) &&
			isNull(ss.lastSearchIDs) &&
			(isString(ss.lastError) || isNull(ss.lastError)) &&
			isString(ss.schedule) &&
			(isString(ss.timezone) || isNull(ss.timezone))
		);
	} catch {
		return false;
	}
};
