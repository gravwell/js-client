/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { ID, RawJSON } from '~/value-objects';
import { Query } from '../query';
import { SearchFilter } from './search-filter';

export interface SearchStats {
	id: ID;
	userID: ID;

	filter?: SearchFilter;

	finished: boolean;

	/** Query typed by the user. */
	query: Query;

	/** Final query (macros expanded). */
	effectiveQuery: Query;

	metadata: RawJSON;
	entries: number;
	duration: string;
	start: Date;
	end: Date;
	minZoomWindow: number;
	downloadFormats: Array<string>;
	tags: Array<string>;

	pipeline: Array<{
		module: string;
		arguments: string;
		duration: number;
		input: {
			bytes: number;
			entries: number;
		};
		output: {
			bytes: number;
			entries: number;
		};
	}>;

	storeSize: number;
	processed: {
		entries: number;
		bytes: number;
	};
}

export interface SearchFrequencyStats {
	timestamp: Date;
	count: number;
}
