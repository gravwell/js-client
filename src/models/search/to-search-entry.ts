/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawSearchEntry } from './raw-search-entry';
import { SearchEntry } from './search-entry';

export const toSearchEntry = (raw: RawSearchEntry): SearchEntry => ({
	source: raw.SRC,
	timestamp: new Date(raw.TS),
	tag: raw.Tag,
	data: raw.Data,
	values: (raw.Enumerated ?? []).map(value => ({
		name: value.Name,
		value: value.ValueStr,
		isEnumerated: isUniversalValue(value.Name) ? false : true,
	})),
});

/** Reference https://docs.gravwell.io/#!search/processingmodules.md#Universal_Enumerated_Values */
const UNIVERSAL_VALUES = new Set(['SRC', 'TAG', 'TIMESTAMP', 'DATA', 'NOW']);
const isUniversalValue = (name: string): boolean => UNIVERSAL_VALUES.has(name);
