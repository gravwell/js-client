/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Observable } from 'rxjs';
import { NumericID, Percentage } from '~/value-objects';
import { SearchEntries } from './search-entries';
import { SearchFilter } from './search-filter';
import { FilteredSearchFrequencyStats, SearchFrequencyStats, SearchStats } from './search-stats';

export interface SearchSubscription {
	progress$: Observable<Percentage>;
	entries$: Observable<SearchEntries>;
	stats$: Observable<SearchStats>;
	statsOverview$: Observable<Array<SearchFrequencyStats>>;
	statsZoom$: Observable<{ filter?: SearchFilter; stats: Array<FilteredSearchFrequencyStats> }>;
	setFilter: (filter: SearchFilter | null) => void;
	searchID: NumericID;
}
