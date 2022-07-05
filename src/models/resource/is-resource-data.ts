/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isDate, isInteger, isString } from 'lodash';
import { isNumericID, isUUID } from '~/value-objects';
import { ResourceData } from './resource-data';

export const isResourceData = (value: unknown): value is ResourceData => {
	try {
		const r = <ResourceData>value;
		return (
			isUUID(r.id) &&
			isNumericID(r.userID) &&
			r.groupIDs.every(isNumericID) &&
			isString(r.name) &&
			isString(r.description) &&
			r.labels.every(isString) &&
			isBoolean(r.isGlobal) &&
			isDate(r.lastUpdateDate) &&
			isInteger(r.version) &&
			isString(r.hash) &&
			isInteger(r.size)
		);
	} catch {
		return false;
	}
};
