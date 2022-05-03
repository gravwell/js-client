/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ElementFilter } from './element-filter';

/**
 * Declarative properties to filter data from a {@link SearchSubscription}.
 */
export interface SearchFilter {
	/** Retrieve entries with pagination. */
	entriesOffset?: {
		/** Entry index starting from zero. */
		index: number;

		/**
		 * Amount of entries to retrieve from the index.
		 *
		 * If you wanted to refer to indexes 2 through 6 inclusive, you'd use
		 * `{ index: 2, count: 5 }`
		 *
		 * ```txt
		 *           ↓ index
		 * | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
		 *         |←----- count -----→|
		 * ```
		 */
		count: number;
	};

	dateRange?:
		| {
				/** Only accept entries with timestamps equal or after that. */
				start?: Date;

				/** Only accept entries with timestamps equal or past that. */
				end?: Date;
		  }
		| 'preview';

	desiredGranularity?: number;

	/**
	 * The number of bins to use when requesting search stats over the original query range
	 */
	overviewGranularity?: number;

	/**
	 * The number of bins to use when requesting search stats over a modified (zoomed) query range
	 */
	zoomGranularity?: number;

	/**
	 * Array of element filters applied when launching the search. Those can't
	 * be set with `SearchSubscription.setFilter()` because they require
	 * launching a new search.
	 */
	elementFilters?: Array<ElementFilter>;
}
