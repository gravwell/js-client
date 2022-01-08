/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export interface SearchEntry {
	/** IP */
	source: string;
	timestamp: Date;
	tag: number;
	/** Raw, binary or text data for the whole entry. Original data. */
	data: string;
	values: Array<SearchEntryValue>;
}

export interface SearchEntryValue {
	name: string;
	value: string;
	/** If it's not enumerated, it's universal. */
	isEnumerated: boolean;
}
