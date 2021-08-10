/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Search } from '~/models/search';

export interface SearchHistoryService {
	readonly get: {
		/**
		 * Returns all searches owned by the current authenticated user.
		 */
		readonly mine: () => Promise<Array<Search>>;
		readonly many: (filter?: { userID?: string; groupID?: string }) => Promise<Array<Search>>;

		/**
		 * Returns all searches owned by all users. Requires admin privilege.
		 */
		readonly all: () => Promise<Array<Search>>;

		readonly authorizedTo: {
			/**
			 * Returns all searches that a specific user has access to. Be it because
			 * he made the search or because he's in the group that owns the search.
			 */
			readonly user: (userID: string) => Promise<Array<Search>>;
		};
	};
}
