/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { addMinutes } from 'date-fns';
import { matches } from 'lodash';
import { firstValueFrom, Observable, skipWhile } from 'rxjs';
import { SearchFilter } from '~/models/search/search-filter';
import { SearchStats } from '~/models/search/search-stats';
import { SearchSubscription } from '~/models/search/search-subscription';

export type CreateSearchFn = (initialFilter: SearchFilter) => Promise<SearchSubscription>;

export const makeKeepDataRangeTest =
	({ start, end, count, createSearch }: { start: Date; end: Date; count: number; createSearch: CreateSearchFn }) =>
	async () => {
		const initialFilter: SearchFilter = { entriesOffset: { index: 0, count }, dateRange: { start, end } };

		const search = await createSearch(initialFilter);
		// Expect the filter to be the initial one
		await expectStatsFilter(search.stats$, initialFilter);

		////
		// Update property
		////
		const updatedDateRange = { dateRange: { start, end: addMinutes(end, 10000) } };
		const entriesUpdatedFilter = { entriesOffset: { index: 0, count: count / 2 } };

		search.setFilter(updatedDateRange);
		// Expect the filter to be the updatedDateRange
		await expectStatsFilter(search.stats$, updatedDateRange);

		// Update twice to clear previous cache
		search.setFilter(entriesUpdatedFilter);
		// Expect the filter data range to still be the updatedDateRange
		await expectStatsFilter(search.stats$, entriesUpdatedFilter);

		search.setFilter(entriesUpdatedFilter);
		// Expect the filter data range to still be the updatedDateRange
		await expectStatsFilter(search.stats$, entriesUpdatedFilter);

		////
		// Check filter
		////
		const stats = await firstValueFrom(search.stats$);
		expect(stats.filter)
			.withContext(`The filter should be equal to the one used, plus the default values for undefined properties`)
			.toPartiallyEqual(updatedDateRange);
	};

export const expectStatsFilter = async (stats$: Observable<SearchStats>, filter: SearchFilter): Promise<void> => {
	const matchesFilter = matches(filter);
	const statsP = firstValueFrom(stats$.pipe(skipWhile(x => matchesFilter(x.filter) === false)));

	await expectAsync(statsP)
		.withContext(`Expecting the filter to be ${JSON.stringify(filter)}`)
		.toBeResolved();
};
