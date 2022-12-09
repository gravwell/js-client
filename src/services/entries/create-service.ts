/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeIngestJSONEntries, makeIngestMultiLineEntry } from '~/functions/ingestors';
import { APIContext } from '~/functions/utils';
import { CreatableJSONEntry } from '~/models';
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
