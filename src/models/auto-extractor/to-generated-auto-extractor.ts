/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { mapValues } from 'lodash';
import { omitUndefinedShallow } from '../../functions/utils';
import { toDataExplorerEntry } from '../search/to-data-explorer-entry';
import { toSearchEntry } from '../search/to-search-entry';
import { GeneratedAutoExtractor, GeneratedAutoExtractors } from './generated-auto-extractors';
import { RawGeneratedAutoExtractors } from './raw-generated-auto-extrators';
import { toAutoExtractor } from './to-auto-extractor';

export const toGeneratedAutoExtractors = (raw: RawGeneratedAutoExtractors): GeneratedAutoExtractors =>
	mapValues(raw, extractors =>
		extractors.map(
			(ex): GeneratedAutoExtractor =>
				omitUndefinedShallow({
					confidence: ex.Confidence,
					entries: (ex.Entries ?? []).map(toSearchEntry),
					explorerEntries: (ex.Explore ?? []).map(toDataExplorerEntry),
					autoExtractor: toAutoExtractor(ex.Extractor),
				}),
		),
	);
