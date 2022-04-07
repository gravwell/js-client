import { addMinutes } from 'date-fns';
import { matches } from 'lodash';
import { firstValueFrom, Observable, skipWhile } from 'rxjs';
import { SearchFilter, SearchStats } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeAttachToOneSearch } from '../attach-to-one-search/attach-to-one-search';
import { makeSubscribeToOneSearch } from '../subscribe-to-one-search/subscribe-to-one-search';

export const keepDataRangeTest = ({ start, end, count }: { start: Date; end: Date; count: number }) => {
	it(
		'Should keep the dateRange when update the filter multiple times',
		integrationTest(async () => {
			const subscribeToOneSearch = makeSubscribeToOneSearch(TEST_BASE_API_CONTEXT);
			const attachToOneSearch = makeAttachToOneSearch(TEST_BASE_API_CONTEXT);

			const query = `tag=*`;
			const initialFilter: SearchFilter = { entriesOffset: { index: 0, count: count }, dateRange: { start, end } };

			const searchCreated = await subscribeToOneSearch(query, { filter: initialFilter });
			const search = await attachToOneSearch(searchCreated.searchID, { filter: initialFilter });
			// Expect the filter to be the initial one
			await expectStatsFilter(search.stats$, initialFilter);

			////
			// Update property
			////
			const updatedDateRange = { dateRange: { start: start, end: addMinutes(end, 10000) } };
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
		}),
		25000,
	);
};

const expectStatsFilter = async (stats$: Observable<SearchStats>, filter: SearchFilter): Promise<void> => {
	const matchesFilter = matches(filter);
	const statsP = firstValueFrom(stats$.pipe(skipWhile(x => matchesFilter(x.filter) === false)));

	await expectAsync(statsP)
		.withContext(`Expecting the filter to be ${JSON.stringify(filter)}`)
		.toBeResolved();
};
