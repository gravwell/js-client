/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { isPersistentSearchData } from './is-persistent-search-data';
import { Search2 } from './search2';

export const isSearch2 = (value: unknown): value is Search2 => {
	try {
		const s = <Search2>value;
		return s._tag === DATA_TYPE.PERSISTENT_SEARCH && isPersistentSearchData(s);
	} catch {
		return false;
	}
};
