/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isArray, isUndefined } from 'lodash';
import { ExploreResult, isExploreResult } from './explore';
import { BaseRendererResponse } from './renderer';
import { isSearchEntry, SearchEntry } from './search-entry';

export interface TextResponse extends BaseRendererResponse {
	Entries?: Array<SearchEntry>;
	Explore?: Array<ExploreResult>;
}

export const isTextResponse = (v: BaseRendererResponse): v is TextResponse => {
	try {
		const t = v as TextResponse;
		const entriesOK = isUndefined(t.Entries) || (isArray(t.Entries) && t.Entries.every(isSearchEntry));
		const exploreOK = isUndefined(t.Entries) || (isArray(t.Explore) && t.Explore.every(isExploreResult));
		return entriesOK && exploreOK;
	} catch {
		return false;
	}
};

//from a functional standpoint Raw and Text are identical
//so just replicate all of their data types
export interface RawResponse extends BaseRendererResponse {
	Entries?: Array<SearchEntry>;
	Explore?: Array<ExploreResult>;
}

export const isRawResponse = (v: BaseRendererResponse): v is RawResponse => {
	try {
		const t = v as RawResponse;
		const entriesOK = isUndefined(t.Entries) || (isArray(t.Entries) && t.Entries.every(isSearchEntry));
		const exploreOK = isUndefined(t.Entries) || (isArray(t.Explore) && t.Explore.every(isExploreResult));
		return entriesOK && exploreOK;
	} catch {
		return false;
	}
};
