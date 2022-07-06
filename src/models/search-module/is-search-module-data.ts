/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isString } from 'lodash';
import { SearchModuleData } from './search-module-data';

export const isSearchModuleData = (value: unknown): value is SearchModuleData => {
	try {
		const m = <SearchModuleData>value;
		return (
			isString(m.name) &&
			isString(m.description) &&
			m.examples.every(isString) &&
			isBoolean(m.frontendOnly) &&
			isBoolean(m.collapsing) &&
			isBoolean(m.sorting)
		);
	} catch {
		return false;
	}
};
