/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isInteger, isUndefined } from 'lodash';
import { isNumericID } from '~/value-objects';
import { Search2, Search2State } from './search2';

export const isSearch2 = (value: any): value is Search2 => {
	try {
		const s = <Search2>value;
		return (
			isNumericID(s.userID) &&
			(isUndefined(s.groupID) || isNumericID(s.groupID)) &&
			s.states.every(isSearch2State) &&
			isInteger(s.attachedClients) &&
			isInteger(s.storedData)
		);
	} catch {
		return false;
	}
};

const isSearch2State = (value: any): value is Search2State =>
	(<Array<Search2State>>['active', 'dormant', 'backgrounded', 'saved', 'saving', 'attached']).includes(value);
