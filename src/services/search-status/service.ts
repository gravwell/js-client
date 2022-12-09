/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Search2 } from '~/models/search';

export interface SearchStatusService {
	readonly get: {
		readonly authorizedTo: {
			/** Returns all persistent searches authorized to the current user. */
			readonly me: () => Promise<Array<Search2>>;
		};

		/** Returns the status of a specific persistent search. */
		readonly one: (searchID: string) => Promise<Search2>;

		/** Returns all persistent searches. */
		readonly all: () => Promise<Array<Search2>>;
	};
}
