/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isDate, isNull, isString } from 'lodash';
import { isNumericID } from '../../value-objects';
import { Macro } from './macro';

export const isMacro = (value: any): value is Macro => {
	try {
		const m = <Macro>value;
		return (
			isNumericID(m.id) &&
			isNumericID(m.userID) &&
			m.groupIDs.every(isNumericID) &&
			isString(m.name) &&
			(isString(m.description) || isNull(m.description)) &&
			m.labels.every(isString) &&
			isString(m.expansion) &&
			isDate(m.lastUpdateDate)
		);
	} catch {
		return false;
	}
};
