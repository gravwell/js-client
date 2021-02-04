/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Observable } from 'rxjs';
import { Percentage } from '../../value-objects';
import { SearchEntries } from './search-entries';
import { SearchFilter } from './search-filter';
import { SearchFrequencyStats, SearchStats } from './search-stats';

export interface SearchSubscription {
	progress$: Observable<Percentage>;
	entries$: Observable<SearchEntries>;
	stats$: Observable<SearchStats>;
	statsOverview$: Observable<Array<SearchFrequencyStats>>;
	statsZoom$: Observable<Array<SearchFrequencyStats>>;
	setFilter: (filter: SearchFilter) => void;
}
