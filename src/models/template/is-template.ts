/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isDate, isNull, isString } from 'lodash';
import { isNumericID, isUUID } from '~/value-objects';
import { Template } from './template';

export const isTemplate = (value: any): value is Template => {
	try {
		const t = <Template>value;
		return (
			isUUID(t.uuid) &&
			isUUID(t.thingUUID) &&
			isNumericID(t.userID) &&
			t.groupIDs.every(isNumericID) &&
			isString(t.name) &&
			(isString(t.description) || isNull(t.description)) &&
			t.labels.every(isString) &&
			isBoolean(t.isGlobal) &&
			isBoolean(t.isRequired) &&
			isDate(t.lastUpdateDate) &&
			isString(t.query) &&
			isString(t.variable.token) &&
			isString(t.variable.name) &&
			(isString(t.variable.description) || isNull(t.variable.description)) &&
			(isString(t.previewValue) || isNull(t.previewValue))
		);
	} catch {
		return false;
	}
};
