/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isArray, isString } from 'lodash';
import { RawJSON, RawNumericID } from '~/value-objects';
import { RawQuery } from '../../query';
import { RawDataExplorerEntry } from '../raw-data-explorer-entry';
import { SearchMessageCommands } from '../search-message-commands';
import {
	RawSearchMessageReceivedRequestEntriesWithinRange,
	RawSearchMessageReceivedRequestEntriesWithinRangeData,
} from './request-entries-within-range';

export interface RawSearchInitiatedMessageReceived {
	type: 'search';
	data: {
		CollapsingIndex: number;
		Metadata: RawJSON;
		ModuleHints: Array<{
			Name: string;
			Condensing: boolean;
			ProducedEVs: Array<string> | null;
			ConsumedEVs: Array<string> | null;
			ResourcesNeeded: Array<string> | null;
		}> | null;
		OutputSearchSubproto: string; // Search ID for later calls
		RawQuery: RawQuery;
		RenderCmd: string;
		RenderModule: string;
		SearchEndRange: string; // timestamp
		SearchID: RawNumericID;
		SearchStartRange: string;
		SearchString: RawQuery;
		Tags: Array<string>;
		TimeZoomDisabled: boolean;
		Addendum?: RawJSON;
		Error?: string;
	};
}

export interface RawSearchErrorResponseReceived {
	type: string; // Search subtype ID eg. "search2"
	data: {
		ID: SearchMessageCommands.ResponseError;
		Error: string;
	};
}

export interface RawResponseForSearchCloseMessageReceived {
	type: string; // Search subtype ID eg. "search2"
	data: { ID: SearchMessageCommands.Close; Addendum?: RawJSON };
}

export interface RawResponseForSearchDetailsMessageReceived {
	type: string; // Search subtype ID eg. "search2"
	data: {
		ID: SearchMessageCommands.RequestDetails;
		Addendum?: RawJSON;
		AdditionalEntries: boolean;
		EntryCount: number;
		Finished: boolean;
		SearchInfo: {
			ID: string;
			UID: RawNumericID;

			UserQuery: RawQuery;
			EffectiveQuery: RawQuery;

			StartRange: string; // timestamp
			EndRange: string; // timestamp

			Started: string; // timestamp
			LastUpdate: string; // timestamp
			Duration: string; // eg. "0s" or "150.21ms"

			CollapsingIndex: number;
			Descending: boolean;
			IndexSize: number;
			ItemCount: number;
			Metadata: RawJSON;
			MinZoomWindow: number;
			NoHistory: boolean;
			RenderDownloadFormats: Array<string>;
			StoreSize: number; // integer
			TimeZoomDisabled: boolean;
		};
	};
}

export interface RawResponseForSearchTagsMessageReceived {
	type: string; // Search subtype ID eg. "search2"
	data: {
		ID: SearchMessageCommands.RequestTags;
		Addendum?: RawJSON;
		Finished: boolean;
		AdditionalEntries: boolean;
		EntryCount: number;
		Tags: { [tag: string]: number }; // The number indicates the order in which you requested the tags, eg. tag=a,b will give you { a: 0, b: 1} while tag=b,a will give you { a: 1, b: 0 }
	};
}

export type RawEntries = RawTableEntries | RawChartEntries | RawTextEntries;

export type RawTextEntries = Array<{
	Data: string; // base64 encoded
	Enumerated: Array<{
		Name: 'Src';
		Value: {
			Type: number;
			Data: string; // base64 encoded
		};
		ValueStr: '112.10.20.10';
	}>;
	SRC: string; // IP
	TS: string; // timestamp
	Tag: number;
}>;

export interface RawTableEntries {
	Columns: Array<string>;
	Rows: Array<{
		TS: string; // timestamp
		Row: Array<string>;
	}>;
}

export interface RawChartEntries {
	Names: Array<string>;
	Values: Array<{
		TS: string; // timestamp
		Data: Array<number | null>;
	}>;
}

export const isRawTableEntries = (v: unknown): v is RawTableEntries => {
	try {
		const e = <RawTableEntries>v;
		return isArray(e.Columns) && e.Columns.every(isString);
	} catch {
		return false;
	}
};

export const isRawChartEntries = (v: RawEntries): v is RawChartEntries => {
	try {
		const e = <RawChartEntries>v;
		return isArray(e.Names) && e.Names.every(isString);
	} catch {
		return false;
	}
};

export interface RawResponseForSearchStatsMessageReceived {
	type: string; // Search subtype ID eg. "search2"
	data: {
		ID: SearchMessageCommands.RequestAllStats;
		Addendum?: RawJSON;
		AdditionalEntries: false;
		EntryCount: number;
		Finished: true;
		Stats: {
			Size: number;
			Current: string; // timestamp
			RangeStart: string; // timestamp
			RangeEnd: string; // timestamp
			Set: Array<{
				TS: string; // timestamp
				Stats: Array<{
					Name: string; // module name eg. "netflow" or "count"
					Args: string; // filter/search module command eg. "netflow Src Bytes" or "count Bytes by Src"
					Duration: number;
					InputBytes: number;
					InputCount: number;
					OutputBytes: number;
					OutputCount: number;
				}>;
			}>;
		};
	};
}

export interface RawResponseForSearchStatsWithinRangeMessageReceived {
	type: string; // Search subtype ID eg. "search2"
	data: {
		ID: SearchMessageCommands.RequestStatsInRange;
		Addendum?: RawJSON;
		AdditionalEntries: false;
		EntryCount: number;
		Finished: true;
		Stats: {
			Size: number;
			Current: string; // timestamp
			RangeStart: string; // timestamp
			RangeEnd: string; // timestamp
			Set: Array<{
				TS: string; // timestamp
				Stats: Array<{
					Name: string; // module name eg. "netflow" or "count"
					Args: string; // filter/search module command eg. "netflow Src Bytes" or "count Bytes by Src"
					Duration: number;
					InputBytes: number;
					InputCount: number;
					OutputBytes: number;
					OutputCount: number;
				}>;
			}>;
		};
	};
}

export interface RawResponseForSearchStatsSummaryMessageReceived {
	type: string; // Search subtype ID eg. "search2"
	data: {
		ID: SearchMessageCommands.RequestStatsSummary;
		Addendum?: RawJSON;
		AdditionalEntries: false;
		EntryCount: number;
		Finished: true;
		Stats: {
			Size: number;
			Set: Array<{
				TS: string; // timestamp
				Stats: Array<{
					Name: string; // module name eg. "netflow" or "count"
					Args: string; // filter/search module command eg. "netflow Src Bytes" or "count Bytes by Src"
					Duration: number;
					InputBytes: number;
					InputCount: number;
					OutputBytes: number;
					OutputCount: number;
				}>;
			}>;
		};
	};
}

export interface RawResponseForSearchStatsLocationMessageReceived {
	type: string; // Search subtype ID eg. "search2"
	data: {
		ID: SearchMessageCommands.RequestStatsLocation;
		Addendum?: RawJSON;
		AdditionalEntries: false;
		EntryCount: number;
		Finished: true;
		Stats: {
			Size: number;
			Current: string; // timestamp
			RangeStart: string; // timestamp
			RangeEnd: string; // timestamp
			Set: [];
		};
	};
}

export interface RawSearchMessageReceivedRequestEntries {
	type: string; // Search subtype ID eg. "search2"
	data: Omit<RawSearchMessageReceivedRequestEntriesWithinRangeData, 'ID'> & {
		ID: SearchMessageCommands.RequestEntries;
	};
}
export interface RawSearchMessageReceivedRequestExplorerEntries {
	type: string; // Search subtype ID eg. "search2"
	data: Omit<RawSearchMessageReceivedRequestEntriesWithinRangeData, 'ID'> & {
		ID: SearchMessageCommands.RequestExplorerEntries;
		Tags: { [tag: string]: number };
		Explore: Array<RawDataExplorerEntry>;
	};
}

export interface RawSearchMessageReceivedRequestExplorerEntriesWithinRange {
	type: string; // Search subtype ID eg. "search2"
	data: Omit<RawSearchMessageReceivedRequestEntriesWithinRangeData, 'ID'> & {
		ID: SearchMessageCommands.RequestExplorerEntriesWithinRange;
		Tags: { [tag: string]: number };
		Explore: Array<RawDataExplorerEntry>;
	};
}

export type RawSearchMessageReceived =
	| RawSearchInitiatedMessageReceived
	| RawResponseForSearchCloseMessageReceived
	| RawResponseForSearchDetailsMessageReceived
	| RawResponseForSearchTagsMessageReceived
	| RawResponseForSearchStatsMessageReceived
	| RawResponseForSearchStatsWithinRangeMessageReceived
	| RawResponseForSearchStatsSummaryMessageReceived
	| RawResponseForSearchStatsLocationMessageReceived
	| RawSearchMessageReceivedRequestEntries
	| RawSearchMessageReceivedRequestEntriesWithinRange
	| RawSearchMessageReceivedRequestExplorerEntries
	| RawSearchMessageReceivedRequestExplorerEntriesWithinRange
	| RawSearchErrorResponseReceived;

export * from './request-entries-within-range';
