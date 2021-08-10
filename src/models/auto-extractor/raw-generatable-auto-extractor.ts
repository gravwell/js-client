/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawSearchEntry } from '~/models/search';

// GenerateAXRequest in Go
export interface RawGeneratableAutoExtractor {
	Tag: string;
	Entries: Array<RawSearchEntry>;
}
