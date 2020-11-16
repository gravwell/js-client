/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isString } from 'lodash';

export interface RawSearchModule {
	Name: string;
	Info: string;
	Examples: Array<string>;

	FrontendOnly: boolean;
	Collapsing: boolean;
	Sorting: boolean;
}

export interface SearchModule {
	name: string;
	description: string;
	examples: Array<string>;

	frontendOnly: boolean;
	collapsing: boolean;
	sorting: boolean;
}

export const toSearchModule = (raw: RawSearchModule): SearchModule => ({
	name: raw.Name,
	description: raw.Info,
	examples: raw.Examples,

	frontendOnly: raw.FrontendOnly,
	collapsing: raw.Collapsing,
	sorting: raw.Sorting,
});

export const isSearchModule = (value: any): value is SearchModule => {
	try {
		const m = <SearchModule>value;
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
