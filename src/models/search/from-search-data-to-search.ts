/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { Search } from './search';
import { SearchData } from './search-data';

export const fromSearchDataToSearch = (data: SearchData): Search => ({
	...data,
	_tag: DATA_TYPE.SEARCH,
});
