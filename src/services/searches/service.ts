/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { SearchFilter, SearchSubscription } from '~/models/search';
import { RawJSON } from '~/value-objects';

export interface SearchesService {
	readonly background: {
		/**
		 * Sends a specific search to the background.
		 */
		readonly one: (searchID: string) => Promise<void>;
	};

	readonly save: {
		/**
		 * Saves a specific search.
		 */
		readonly one: (searchID: string) => Promise<void>;
	};

	readonly delete: {
		/**
		 * Deletes a specific search.
		 */
		readonly one: (searchID: string) => Promise<void>;
	};

	readonly download: {
		readonly one: (searchID: string, downloadFormat: string) => Promise<string>;
	};

	readonly create: {
		readonly one: (
			query: string,
			options?: {
				filter?: SearchFilter | undefined;
				metadata?: RawJSON | undefined;
			},
		) => Promise<SearchSubscription>;
	};

	readonly stop: {
		readonly one: (searchID: string) => Promise<void>;
	};
}
