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
import { SearchFrequencyStats, SearchStats } from './search-stats';

export interface SearchSubscription {
	// TODO: maybe use a getSearchID() instead. To indicate that it's mutable
	searchID: NumericID;

	progress$: Observable<Percentage>;
	entries$: Observable<SearchEntries>;
	errors$: Observable<Error>;
	stats$: Observable<SearchStats>;
	statsOverview$: Observable<{ frequencyStats: Array<SearchFrequencyStats> }>;
	statsZoom$: Observable<{ filter?: SearchFilter; frequencyStats: Array<SearchFrequencyStats> }>;

	setFilter: (filter: Omit<SearchFilter, 'elementFilters'> | null) => void;
	relaunch: (relaunchOptions?: { range?: [Date, Date]; filter?: SearchFilter }) => Promise<void>;
}
