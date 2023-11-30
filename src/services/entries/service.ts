/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableJSONEntry } from '~/models/entry/creatable-json-entry';
import { CreatableMultiLineEntry } from '~/models/entry/creatable-multi-line-entry';

export interface EntriesService {
	readonly ingest: {
		readonly one: {
			readonly json: (entry: CreatableJSONEntry) => Promise<number>;
		};
		readonly many: {
			readonly json: (entries: Array<CreatableJSONEntry>) => Promise<number>;
		};
		readonly byLine: (entry: CreatableMultiLineEntry) => Promise<number>;
	};
}
