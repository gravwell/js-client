/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawQuery } from '../query';
import { SearchMessageCommands } from './search-message-commands';

export interface RawInformSubscriptionsMessageSent {
	Subs: Array<'PONG' | 'parse' | 'search' | 'attach'>;
}

export interface RawInitiateSearchMessageSent {
	type: 'search';
	data: {
		Background: boolean;
		Metadata: { durationString: string; timeframe: string };
		SearchEnd: string; // timestamp
		SearchStart: string; // timestamp
		SearchString: RawQuery;
	};
}

export interface RawAcceptSearchMessageSent {
	type: 'search';
	data: { OK: true; OutputSearchSubproto: string };
}

export interface RawRequestSearchCloseMessageSent {
	type: string; // Search subtype ID eg. "search2"
	data: { ID: SearchMessageCommands.Close };
}

export interface RawRequestSearchDetailsMessageSent {
	type: string; // Search subtype ID eg. "search2"
	data: { ID: SearchMessageCommands.RequestDetails };
}

export interface RawRequestSearchTagsMessageSent {
	type: string; // Search subtype ID eg. "search2"
	data: { ID: SearchMessageCommands.RequestTags };
}

export interface RawRequestSearchEntriesWithinRangeMessageSent {
	type: string; // Search subtype ID eg. "search2"
	data: {
		ID: SearchMessageCommands.RequestEntriesWithinRange;
		Addendum: { customView?: string };
		EntryRange: {
			First: number;
			Last: number;
			StartTS: string; // timestamp
			EndTS: string; // timestamp
		};
	};
}

export interface RawRequestSearchStatsMessageSent {
	type: string; // Search subtype ID eg. "search2"
	data: {
		ID: SearchMessageCommands.RequestAllStats;
		Stats: { SetCount: number };
	};
}

export interface RawRequestSearchStatsWithinRangeMessageSent {
	type: string; // Search subtype ID eg. "search2"
	data: {
		ID: SearchMessageCommands.RequestStatsInRange;
		Stats: {
			SetCount: number;
			SetEnd: string; // timestamp
			SetStart: string; // timestamp
		};
	};
}

export interface RawRequestSearchStatsSummaryMessageSent {
	type: string; // Search subtype ID eg. "search2"
	data: {
		ID: SearchMessageCommands.RequestStatsSummary;
	};
}

export interface RawRequestSearchStatsLocationMessageSent {
	type: string; // Search subtype ID eg. "search2"
	data: {
		ID: SearchMessageCommands.RequestStatsLocation;
	};
}

export type RawSearchMessageSent =
	| RawInformSubscriptionsMessageSent
	| RawInitiateSearchMessageSent
	| RawAcceptSearchMessageSent
	| RawRequestSearchCloseMessageSent
	| RawRequestSearchDetailsMessageSent
	| RawRequestSearchTagsMessageSent
	| RawRequestSearchEntriesWithinRangeMessageSent
	| RawRequestSearchStatsMessageSent
	| RawRequestSearchStatsWithinRangeMessageSent
	| RawRequestSearchStatsSummaryMessageSent
	| RawRequestSearchStatsLocationMessageSent;
