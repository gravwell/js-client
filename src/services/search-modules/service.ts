/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { SearchModule } from '~/models/search-module';

export interface SearchModulesService {
	readonly get: {
		readonly all: () => Promise<Array<SearchModule>>;
	};
}
