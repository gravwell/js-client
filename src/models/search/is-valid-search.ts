/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { isValidSearchData } from './is-valid-search-data';
import { Search } from './search';

export const isValidSearch = (value: unknown): value is Search => {
	try {
		const s = <Search>value;
		return s._tag === DATA_TYPE.SEARCH && isValidSearchData(s);
	} catch {
		return false;
	}
};
