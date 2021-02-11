/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { FieldFilterOperation } from './field-filter-operation';

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

	dateRange?: {
		/** Only accept entries with timestamps equal or after that. */
		start?: Date;

		/** Only accept entries with timestamps equal or past that. */
		end?: Date;
	};

	desiredGranularity?: number;

	// TODO: Implement field filters
	// fieldFilters?: Array<FieldFilter>;
}

export interface FieldFilter {
	field: string;
	operation: FieldFilterOperation;
	value: string;
}
