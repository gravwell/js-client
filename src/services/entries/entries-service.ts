/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableJSONEntry, CreatableMultiLineEntry } from '../../models/entry';

export interface EntriesService {
	ingest: {
		one: {
			json: (entry: CreatableJSONEntry) => Promise<number>;
		};
		many: {
			json: (entries: Array<CreatableJSONEntry>) => Promise<number>;
		};
		byLine: (entry: CreatableMultiLineEntry) => Promise<number>;
	};
}
