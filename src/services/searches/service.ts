/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { SearchDetails, SearchFilter, SearchSubscription } from '~/models/search';
import { ID, RawJSON } from '~/value-objects';
import { UpdatableSearchDetails } from '../../models/search/updatable-search-details';

export interface SearchesService {
	readonly background: {
		/** Sends a specific search to the background. */
		readonly one: (searchID: string) => Promise<void>;
	};

	readonly save: {
		/** Saves a specific search. */
		readonly one: (searchID: string) => Promise<void>;
	};

	readonly delete: {
		/** Deletes a specific search. */
		readonly one: (searchID: string) => Promise<void>;
	};

	readonly download: {
		readonly one: (searchID: string, downloadFormat: string) => Promise<string>;
	};

	readonly get: {
		readonly one: (searchID: ID) => Promise<SearchSubscription>;
	};

	readonly create: {
		readonly one: (
			query: string,
			options?: {
				filter?: SearchFilter | undefined;
				metadata?: RawJSON | undefined;
				noHistory?: boolean;
			},
		) => Promise<SearchSubscription>;
	};

	readonly update: {
		readonly one: (data: UpdatableSearchDetails) => Promise<SearchDetails>;
	};

	readonly stop: {
		readonly one: (searchID: string) => Promise<void>;
	};
}
