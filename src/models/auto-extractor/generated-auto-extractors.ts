/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { DataExplorerEntry } from '../search/data-explorer-entry';
import { SearchEntry } from '../search/search-entry';
import { AutoExtractor } from './auto-extractor';

export interface GeneratedAutoExtractor {
	confidence?: number;
	autoExtractor: AutoExtractor;
	entries: Array<SearchEntry>;
	explorerEntries: Array<DataExplorerEntry>;
}

export interface GeneratedAutoExtractors {
	[key: string]: Array<GeneratedAutoExtractor>;
}
