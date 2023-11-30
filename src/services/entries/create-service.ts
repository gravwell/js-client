/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeIngestJSONEntries } from '~/functions/ingestors/ingest-json-entries';
import { makeIngestMultiLineEntry } from '~/functions/ingestors/ingest-multi-line-entry';
import { APIContext } from '~/functions/utils/api-context';
import { CreatableJSONEntry } from '~/models/entry/creatable-json-entry';
import { EntriesService } from './service';

export const createEntriesService = (context: APIContext): EntriesService => ({
	ingest: {
		one: {
			json: (entry: CreatableJSONEntry) => makeIngestJSONEntries(context)([entry]),
		},

		many: {
			json: makeIngestJSONEntries(context),
		},

		byLine: makeIngestMultiLineEntry(context),
	},
});
