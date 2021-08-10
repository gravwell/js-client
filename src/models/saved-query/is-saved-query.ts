/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isNull, isString } from 'lodash';
import { isNumericID, isUUID } from '~/value-objects';
import { isTimeframe } from '../timeframe';
import { SavedQuery } from './saved-query';

export const isSavedQuery = (value: any): value is SavedQuery => {
	try {
		const q = <SavedQuery>value;
		return (
			isUUID(q.id) &&
			isUUID(q.globalID) &&
			isNumericID(q.userID) &&
			q.groupIDs.every(isNumericID) &&
			isBoolean(q.isGlobal) &&
			isString(q.name) &&
			(isString(q.description) || isNull(q.description)) &&
			q.labels.every(isString) &&
			isString(q.query) &&
			(isTimeframe(q.defaultTimeframe) || isNull(q.defaultTimeframe))
		);
	} catch {
		return false;
	}
};
