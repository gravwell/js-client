/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isBoolean, isDate, isNull, isString, isUndefined } from 'lodash';
import { DATA_TYPE } from '~/models/data-type';
import { isNumericID, isUUID } from '~/value-objects/id';
import { Template, TemplateVariable } from './template';
import { TemplateData } from './template-data';

export const isTemplate = (value: unknown): value is Template => {
	try {
		const t = value as Template;
		return t._tag === DATA_TYPE.TEMPLATE && isTemplateData(t);
	} catch {
		return false;
	}
};

export const isTemplateVariable = (value: unknown): value is TemplateVariable => {
	try {
		const v = value as TemplateVariable;
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

export const isTemplateData = (value: unknown): value is TemplateData => {
	try {
		const t = value as TemplateData;
		return (
			isUUID(t.globalID) &&
			isUUID(t.id) &&
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
