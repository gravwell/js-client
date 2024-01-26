/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { DATA_TYPE } from '~/models/data-type';
import { SearchModule } from './search-module';
import { SearchModuleData } from './search-module-data';

export const fromSearchModuleDataToSearchModule = (data: SearchModuleData): SearchModule => ({
	...data,
	_tag: DATA_TYPE.SEARCH_MODULE,
});
