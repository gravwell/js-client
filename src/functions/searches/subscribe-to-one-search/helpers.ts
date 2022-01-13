/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { add } from 'date-fns';
import { isNil, last } from 'lodash';
import {
	RawResponseForSearchStatsMessageReceived,
	RawResponseForSearchStatsWithinRangeMessageReceived,
	RawSearchAttachedMessageReceived,
	RawSearchInitiatedMessageReceived,
	RawSearchMessageReceived,
	SearchEntries,
	SearchFilter,
	SearchFrequencyStats,
	SearchMessageCommands,
} from '~/models';

const DEFAULT_GRANULARITY_MAP: Record<SearchEntries['type'], number> = {
	chart: 160,
	fdg: 2000,
	gauge: 100, // *NOTE: Couldn't find it in environments.ts, using the same as table
	heatmap: 10000,
	point2point: 1000, // *NOTE: Couldn't find it in environments.ts, using the same as pointmap
	pointmap: 1000,
	raw: 50,
	text: 50,
	wordcloud: 50,
	stackgraph: 150,
	table: 100,
	pcap: 50,
	hex: 50,
};

export const getDefaultGranularityByRendererType = (rendererType: SearchEntries['type']): number => {
	const v = DEFAULT_GRANULARITY_MAP[rendererType];
	if (isNil(v)) {
		console.log(`Unknown renderer ${rendererType}, will use 100 as the default granularity`);
		return 100;
	}
	return v;
};

export const countEntriesFromModules = (
	msg: RawResponseForSearchStatsMessageReceived | RawResponseForSearchStatsWithinRangeMessageReceived,
): Array<SearchFrequencyStats> => {
	const statsSet = msg.data.Stats.Set;
	return statsSet.map(set => ({
		timestamp: new Date(set.TS),
		count: last(set.Stats)?.OutputCount ?? 0,
	}));
};

export const filterMessageByCommand = <Command extends SearchMessageCommands>(command: Command) => <
	M extends RawSearchMessageReceived
>(
	msg: M,
): msg is Extract<M, { data: { ID: Command } }> => {
	try {
		const _msg = msg as Exclude<
			RawSearchMessageReceived,
			RawSearchInitiatedMessageReceived | RawSearchAttachedMessageReceived
		>;
		return _msg.data?.ID === command;
	} catch {
		return false;
	}
};

export type RequiredSearchFilter = Required<
	Omit<SearchFilter, 'dateRange'> & { dateRange: Required<NonNullable<SearchFilter['dateRange']>> }
>;

export const SEARCH_FILTER_PREFIX = 'search-filter-';

export const recalculateZoomEnd = (minZoomWindow: number, count: number, start: Date, end: Date): Date => {
	const origDeltaS = end.getTime() / 1000 - start.getTime() / 1000;
	const deltaS = Math.ceil(origDeltaS / (minZoomWindow * count)) * (minZoomWindow * count);
	const newEnd = add(start, { seconds: deltaS });

	return newEnd;
};
