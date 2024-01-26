/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { DATA_TYPE } from '~/models/data-type';
import { isSearchModuleData } from '~/models/search-module/is-search-module-data';
import { SearchModule } from './search-module';

export const isSearchModule = (value: unknown): value is SearchModule => {
	try {
		const m = value as SearchModule;
		return m._tag === DATA_TYPE.SEARCH_MODULE && isSearchModuleData(m);
	} catch {
		return false;
	}
};
