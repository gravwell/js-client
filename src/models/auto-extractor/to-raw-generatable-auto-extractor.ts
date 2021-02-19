/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { GeneratableAutoExtractor } from './generatable-auto-extractor';
import { RawGeneratableAutoExtractor } from './raw-generatable-auto-extractor';

export const toRawGeneratableAutoExtractor = (data: GeneratableAutoExtractor): RawGeneratableAutoExtractor => ({
	Tag: data.tag,
	Entries: data.entries.data.map(e => ({
		TS: e.timestamp.toISOString(),
		Tag: e.tag,
		SRC: e.source,
		Data: e.data,
		Enumerated: [],
	})),
});
