/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawDataExplorerResult } from '../search';
import { SearchEntry } from '../search/search-entry';
import { AutoExtractor } from './auto-extractor';

export interface GeneratedAutoExtractor {
	autoExtractor: AutoExtractor;
	entries: Array<SearchEntry>;
	explorerElements: Array<RawDataExplorerResult>;
}

export interface GeneratedAutoExtractors {
	[key: string]: Array<GeneratedAutoExtractor>;
}
