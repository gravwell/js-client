/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isDate, isNull, isString, isUndefined } from 'lodash';
import { isNumericID, isUUID } from '~/value-objects';
import { Template, TemplateVariable } from './template';

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
			isDate(t.lastUpdateDate) &&
			isString(t.query) &&
			t.variables.every(isTemplateVariable)
		);
	} catch {
		return false;
	}
};
export const isTemplateVariable = (value: unknown): value is TemplateVariable => {
	try {
		const v = <TemplateVariable>value;
		return (
			isString(v.label) &&
			isString(v.name) &&
			(isString(v.description) || isUndefined(v.description)) &&
			(isBoolean(v.required) || isUndefined(v.required)) &&
			(isString(v.defaultValue) || isUndefined(v.defaultValue)) &&
			(isString(v.previewValue) || isUndefined(v.previewValue) || isNull(v.previewValue))
		);
	} catch {
		return false;
	}
};
