/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { mapValues } from 'lodash';
import { GeneratedAutoExtractors, RawGeneratedAutoExtractors, toAutoExtractor } from '.';

export const toGeneratedAutoExtractors = (raw: RawGeneratedAutoExtractors): GeneratedAutoExtractors =>
	mapValues(raw, extractors =>
		extractors.map(ex => ({
			entries: ex.Entries,
			explore: ex.Explore,
			autoextractor: toAutoExtractor(ex.Extractor),
		})),
	);
