/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Observable, scan } from 'rxjs';
import { SearchFilter } from '~/index';
import { RequiredSearchFilter } from '../subscribe-to-one-search/helpers';

export type DateRange = { start: Date; end: Date };

export type CreateRequiredSearchFilterObservable = {
	/** Observable that will receives the properties of search to be updated */
	filter$: Observable<SearchFilter>;

	/** First filter that will be emitted by the source */
	initialFilter: RequiredSearchFilter;

	/** Date range used on preview */
	previewDateRange: DateRange;

	/** Values used in the lack of a initial filter value */
	defaultValues: {
		dateStart: Date;
		dateEnd: Date;
	};
};

/**
 * Creates the necessary properties to control the filter of a search.
 *
 * @returns An observable that emits the updated search
 */
export const createRequiredSearchFilterObservable = ({
	filter$,
	initialFilter,
	previewDateRange,
	defaultValues,
}: CreateRequiredSearchFilterObservable): Observable<RequiredSearchFilter> => {
	const expandDateRange = (dateRange: SearchFilter['dateRange']): Partial<DateRange> => {
		if (dateRange === 'preview') {
			return previewDateRange;
		}
		return dateRange ?? {};
	};

	const searchFilter$: Observable<RequiredSearchFilter> = filter$.pipe(
		scan(
			(acc, curr) => ({
				entriesOffset: {
					index: curr.entriesOffset?.index ?? acc.entriesOffset.index,
					count: curr.entriesOffset?.count ?? acc.entriesOffset.count,
				},
				dateRange: {
					start: defaultValues.dateStart,
					end: defaultValues.dateEnd,
					...expandDateRange(acc.dateRange),
					...expandDateRange(curr.dateRange),
				},
				desiredGranularity: curr.desiredGranularity ?? acc.desiredGranularity,
				overviewGranularity: curr.overviewGranularity ?? acc.overviewGranularity,
				zoomGranularity: curr.zoomGranularity ?? acc.zoomGranularity,
				elementFilters: initialFilter.elementFilters,
			}),
			initialFilter,
		),
	);

	return searchFilter$;
};
