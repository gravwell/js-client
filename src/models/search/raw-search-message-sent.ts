/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawJSON } from '~/value-objects';
import { RawQuery } from '../query';
import { SearchMessageCommands } from './search-message-commands';

export interface RawInformSubscriptionsMessageSent {
	Subs: Array<'PONG' | 'parse' | 'search' | 'attach'>;
}

export interface RawPongMessageSent {
	type: 'PONG';
	data: {};
}

export interface RawInitiateSearchMessageSent {
	type: 'search';
	data: {
		Background: boolean;
		Metadata: RawJSON;
		SearchEnd: string; // timestamp
		SearchStart: string; // timestamp
		SearchString: RawQuery;
		Addendum?: RawJSON;

		/**
		 * Per the Go client docs:
		 *
		 * > Preview indicates that the renderer should only capture enough to show some usage of data
		 *   A raw, text, hex renderer will grab a few hundred or thousand entries
		 *   charts will grab enough to draw something useful everything else will get "enough"
		 */
		Preview: boolean;

		/**
		 * Set to `true` to avoid saving the search query in the history.
		 *
		 * @default false
		 */
		NoHistory?: boolean;
	};
}

export interface RawAcceptSearchMessageSent {
	type: 'search';
	data: { OK: true; OutputSearchSubproto: string; Addendum?: RawJSON };
}

export interface RawRequestSearchCloseMessageSent {
	type: string; // Search subtype ID eg. "search2"
	data: { ID: SearchMessageCommands.Close; Addendum?: RawJSON };
}

export interface RawRequestSearchDetailsMessageSent {
	type: string; // Search subtype ID eg. "search2"
	data: { ID: SearchMessageCommands.RequestDetails; Addendum?: RawJSON };
}

export interface RawRequestSearchTagsMessageSent {
	type: string; // Search subtype ID eg. "search2"
	data: { ID: SearchMessageCommands.RequestTags; Addendum?: RawJSON };
}

export interface RawRequestSearchEntriesMessageSent {
	type: string; // Search subtype ID eg. "search2"
	data: {
		ID: SearchMessageCommands.RequestEntries;
		Addendum?: RawJSON;
		EntryRange: {
			/**
			 * @default 0
			 */
			First?: number;

			/**
			 * @default 1
			 */
			Last?: number;

			// StartTS?: string; // timestamp, this field is ignored, see gravwell#3064
			// EndTS?: string; // timestamp, this field is ignored, see gravwell#3064
		};
	};
}

export interface RawRequestSearchEntriesWithinRangeMessageSent {
	type: string; // Search subtype ID eg. "search2"
	data: {
		ID: SearchMessageCommands.RequestEntriesWithinRange;
		Addendum?: RawJSON;
		EntryRange: {
			First: number;
			Last: number;
			StartTS: string; // timestamp
			EndTS: string; // timestamp
		};
	};
}

export interface RawRequestExplorerSearchEntriesMessageSent {
	type: string; // Search subtype ID eg. "search2"
	data: {
		ID: SearchMessageCommands.RequestExplorerEntries;
		Addendum?: RawJSON;
		EntryRange: {
			/**
			 * @default 0
			 */
			First?: number;

			/**
			 * @default 1
			 */
			Last?: number;

			// StartTS?: string; // timestamp, this field is ignored, see gravwell#3064
			// EndTS?: string; // timestamp, this field is ignored, see gravwell#3064
		};
	};
}

export interface RawRequestExplorerSearchEntriesWithinRangeMessageSent {
	type: string; // Search subtype ID eg. "search2"
	data: {
		ID: SearchMessageCommands.RequestExplorerEntriesWithinRange;
		Addendum?: RawJSON;
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
		Addendum?: RawJSON;
		Stats: { SetCount: number };
	};
}

export interface RawRequestSearchStatsWithinRangeMessageSent {
	type: string; // Search subtype ID eg. "search2"
	data: {
		ID: SearchMessageCommands.RequestStatsInRange;
		Addendum?: RawJSON;
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
		Addendum?: RawJSON;
	};
}

export interface RawRequestSearchStatsLocationMessageSent {
	type: string; // Search subtype ID eg. "search2"
	data: {
		ID: SearchMessageCommands.RequestStatsLocation;
		Addendum?: RawJSON;
	};
}

export type RawSearchMessageSent =
	| RawInformSubscriptionsMessageSent
	| RawPongMessageSent
	| RawInitiateSearchMessageSent
	| RawAcceptSearchMessageSent
	| RawRequestSearchCloseMessageSent
	| RawRequestSearchDetailsMessageSent
	| RawRequestSearchTagsMessageSent
	| RawRequestSearchEntriesMessageSent
	| RawRequestSearchEntriesWithinRangeMessageSent
	| RawRequestExplorerSearchEntriesMessageSent
	| RawRequestExplorerSearchEntriesWithinRangeMessageSent
	| RawRequestSearchStatsMessageSent
	| RawRequestSearchStatsWithinRangeMessageSent
	| RawRequestSearchStatsSummaryMessageSent
	| RawRequestSearchStatsLocationMessageSent;
