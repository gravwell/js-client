/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isDate, isNull, isString } from 'lodash';
import { isNumericID, isUUID } from '~/value-objects';
import { ActionableData } from './actionable-data';
import { isActionableAction, isActionableTrigger } from './is-actionable';

export const isActionableData = (value: unknown): value is ActionableData => {
	try {
		const a = <ActionableData>value;
		return (
			isUUID(a.globalID) &&
			isUUID(a.id) &&
			isNumericID(a.userID) &&
			a.groupIDs.every(isNumericID) &&
			isString(a.name) &&
			(isString(a.description) || isNull(a.description)) &&
			(isString(a.menuLabel) || isNull(a.menuLabel)) &&
			a.labels.every(isString) &&
			isBoolean(a.isGlobal) &&
			isBoolean(a.isDisabled) &&
			isDate(a.lastUpdateDate) &&
			a.triggers.every(isActionableTrigger) &&
			a.actions.every(isActionableAction)
		);
	} catch {
		return false;
	}
};
