/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isInteger, isUndefined } from 'lodash';
import { isNumericID } from '~/value-objects';
import { PersistentSearchDataState } from './persistent-search-data';
import { Search2 } from './search2';

export const isPersistentSearchData = (value: unknown): value is Search2 => {
	try {
		const s = <Search2>value;
		return (
			isNumericID(s.userID) &&
			(isUndefined(s.groupID) || isNumericID(s.groupID)) &&
			s.states.every(isPersistentSearchState) &&
			isInteger(s.attachedClients) &&
			isInteger(s.storedData)
		);
	} catch {
		return false;
	}
};

const isPersistentSearchState = (value: any): value is PersistentSearchDataState =>
	(<Array<PersistentSearchDataState>>['active', 'dormant', 'backgrounded', 'saved', 'saving', 'attached']).includes(
		value,
	);
