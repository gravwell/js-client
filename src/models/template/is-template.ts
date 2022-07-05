/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isNull, isString, isUndefined } from 'lodash';
import { DATA_TYPE } from '~/models';
import { isTemplateData } from './is-template-data';
import { Template, TemplateVariable } from './template';

export const isTemplate = (value: unknown): value is Template => {
	try {
		const t = <Template>value;
		return t._tag === DATA_TYPE.TEMPLATE && isTemplateData(t);
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
