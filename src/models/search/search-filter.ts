/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

/**
 * Declarative properties to filter data from a {@link SearchSubscription}.
 */
export interface SearchFilter {
	/** Retrieve entries with pagination. */
	entriesOffset?: {
		/** Offset index ("page" number). */
		index: number;

		/** Amount of entries per offset (entries per "page"). */
		count: number;
	};

	dateRange?: {
		/** Only accept entries with timestamps equal or after that. */
		start?: Date;

		/** Only accept entries with timestamps equal or past that. */
		end?: Date;
	};

	desiredGranularity?: number;

	fieldFilters?: Array<FieldFilter>;
}

export type FieldFilterOperation = 'EQ' | 'NEQ' | 'GT' | 'LT' | 'GTE' | 'LTE';
export interface FieldFilter {
	field: string;
	operation: FieldFilterOperation;
	value: string;
}
