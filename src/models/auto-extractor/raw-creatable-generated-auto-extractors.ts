/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawSearchEntry } from '../search';

// Named as GenerateAXRequest in the Go source
/**
 * Contains a tag name and a set of entries. It is used by clients to request
 * all possible extractions from the given entries. All entries should have the
 * same tag.
 */
export interface RawCreatableGeneratedAutoExtractors {
	Tag: string;
	Entries: Array<RawSearchEntry>;
}
