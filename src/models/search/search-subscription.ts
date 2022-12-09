/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Observable } from 'rxjs';
import { NumericID, Percentage } from '~/value-objects';
import { SearchEntries } from './search-entries';
import { SearchFilter } from './search-filter';
import { SearchFrequencyStats, SearchStats } from './search-stats';

export interface SearchSubscription {
	searchID: NumericID;

	progress$: Observable<Percentage>;
	entries$: Observable<SearchEntries>;
	errors$: Observable<Error>;
	stats$: Observable<SearchStats>;
	statsOverview$: Observable<{ frequencyStats: Array<SearchFrequencyStats> }>;
	statsZoom$: Observable<{ filter?: SearchFilter; frequencyStats: Array<SearchFrequencyStats> }>;

	setFilter: (filter: Omit<SearchFilter, 'elementFilters' | 'previewMode'> | null) => void;
	close: () => Promise<void>;
}
