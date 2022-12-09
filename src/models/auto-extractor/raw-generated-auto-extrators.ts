/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawDataExplorerEntry, RawSearchEntry } from '../search';
import { RawAutoExtractor } from './raw-auto-extractor';

/** Maps extractor module names to arrays of guesses */
export interface RawGeneratedAutoExtractors {
	[key: string]: Array<RawGeneratedAutoExtractor>;
}

// Named as GenerateAXResponse in the Go source
/**
 * Contains an auto extractor and corresponding Element extractions as gathered
 * from a single extraction module
 */
export interface RawGeneratedAutoExtractor {
	Extractor: RawAutoExtractor;
	Confidence?: number;
	Entries: Array<RawSearchEntry> | null;
	Explore: Array<RawDataExplorerEntry> | null;
}
