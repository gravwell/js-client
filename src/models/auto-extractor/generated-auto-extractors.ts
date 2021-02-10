/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawDataExplorerResult, RawSearchEntry } from '../search';
import { AutoExtractor } from './auto-extractor';

export interface GeneratedAutoExtractor {
	autoextractor: AutoExtractor;
	entries: Array<RawSearchEntry>;
	explore: Array<RawDataExplorerResult>;
}

export interface GeneratedAutoExtractors {
	[key: string]: Array<GeneratedAutoExtractor>;
}
