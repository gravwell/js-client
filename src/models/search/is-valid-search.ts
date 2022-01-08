/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isDate, isString, isUndefined } from 'lodash';
import { isNumericID } from '~/value-objects';
import { Search } from './search';

export const isValidSearch = (value: any): value is Search => {
	try {
		const s = <Search>value;
		return (
			isNumericID(s.userID) &&
			(isUndefined(s.groupID) || isNumericID(s.groupID)) &&
			isString(s.effectiveQuery) &&
			isString(s.userQuery) &&
			isDate(s.launchDate)
		);
	} catch {
		return false;
	}
};
