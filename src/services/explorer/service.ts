/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { DataExplorerEntry } from '~/models/search/data-explorer-entry';
import { ExplorerSearchSubscription } from '~/models/search/explorer-search-subscription';
import { SearchFilter } from '~/models/search/search-filter';
import { ID } from '~/value-objects/id';
import { RawJSON } from '~/value-objects/json';

export interface ExplorerService {
	readonly explore: {
		readonly one: (tag: string) => Promise<Array<DataExplorerEntry>>;
	};

	readonly searchAndExplore: {
		readonly one: (
			query: string,
			options?: {
				filter?: SearchFilter | undefined;
				metadata?: RawJSON | undefined;
				noHistory?: boolean;
			},
		) => Promise<ExplorerSearchSubscription>;
	};

	readonly get: {
		readonly one: (searchID: ID) => Promise<ExplorerSearchSubscription>;
	};
}
