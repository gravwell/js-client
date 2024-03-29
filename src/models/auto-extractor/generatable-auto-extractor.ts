/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawSearchEntries } from '../search/search-entries';

export interface GeneratableAutoExtractor {
	tag: string;
	entries: RawSearchEntries;
}
