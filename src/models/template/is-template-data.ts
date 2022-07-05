/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isDate, isNull, isString } from 'lodash';
import { isNumericID, isUUID } from '~/value-objects';
import { isTemplateVariable } from './is-template';
import { TemplateData } from './template-data';

export const isTemplateData = (value: unknown): value is TemplateData => {
	try {
		const t = <TemplateData>value;
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
