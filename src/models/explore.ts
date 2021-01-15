/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ExploreResult } from './renderer-responses/explore';
import { SearchEntry } from './renderer-responses/search-entry';

export interface AXDefinition {
	Name?: string;
	Desc?: string;
	Module: string;
	Params: string;
	Args?: string;
	Tag: string;
	Labels: Array<string>;
	UID: number;
	GIDs: Array<number>;
	Global: boolean;
	UUID: string;
	LastUpdated: string;
}

// A GenerateAXRequest contains a tag name and a set of entries.
// It is used by clients to request all possible extractions from the given entries.
// All entries should have the same tag.
export interface GenerateAXRequest {
	Tag: string;
	Entries: Array<SearchEntry>;
}

// A GenerateAXResponse contains an autoextractor definition
// and corresponding Element extractions as gathered from a single extraction module
export interface GenerateAXResponse {
	Extractor: AXDefinition;
	Entries: Array<SearchEntry>;
	Explore: Array<ExploreResult>;
}
