/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DataExplorerEntry } from './data-explorer-entry';
import {
	RawSearchMessageReceivedRequestEntriesWithinRangeChartRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangeFDGRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangeGaugeRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangeHeatmapRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangeHexRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangePcapRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangePointmapRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangePointToPointRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangeRawRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangeStackGraphRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangeTableRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangeWordcloudRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangeTextRenderer,
} from './raw-search-message-received';
import { SearchEntry } from './search-entry';
import { SearchFilter } from './search-filter';
import { toSearchEntry } from './to-search-entry';

export type SearchEntries =
	| ChartSearchEntries
	| FDGSearchEntries
	| GaugeSearchEntries
	| HeatmapSearchEntries
	| PointToPointSearchEntries
	| PointmapSearchEntries
	| RawSearchEntries
	| TextSearchEntries
	| StackGraphSearchEntries
	| TableSearchEntries
	| HexSearchEntries
	| PcapSearchEntries
	| WordcloudSearchEntries;

export type ExplorerSearchEntries = SearchEntries & { explorerEntries: Array<DataExplorerEntry> };

// TODO: Add render module to entries observable
export interface BaseSearchEntries {
	filter?: SearchFilter;
	start: Date;
	end: Date;
	finished: boolean;
}

export interface ChartSearchEntries extends BaseSearchEntries {
	type: 'chart';

	// TODO
	names: Array<string>;
	data: Array<{
		timestamp: Date;
		values: Array<string | number | null>;
	}>;
}

export const normalizeToChartSearchEntries = (
	v: RawSearchMessageReceivedRequestEntriesWithinRangeChartRenderer,
): Omit<ChartSearchEntries, 'filter'> => {
	return {
		start: new Date(v.EntryRange.StartTS),
		end: new Date(v.EntryRange.EndTS),
		finished: v.Finished,
		type: 'chart',
		names: v.Entries?.Categories ?? [],
		data: (v.Entries?.Values ?? []).map(rawV => ({
			timestamp: new Date(rawV.TS),
			values: rawV.Data,
		})),
	};
};

export interface FDGSearchEntries extends BaseSearchEntries {
	type: 'fdg';

	// TODO
	nodes: Array<FDGNode>;
	edges: Array<FDGEdge>;
	groups: Array<string>;
}

export const normalizeToFDGSearchEntries = (
	v: RawSearchMessageReceivedRequestEntriesWithinRangeFDGRenderer,
): Omit<FDGSearchEntries, 'filter'> => {
	return {
		start: new Date(v.EntryRange.StartTS),
		end: new Date(v.EntryRange.EndTS),
		finished: v.Finished,
		type: 'fdg',
		nodes: (v.Entries?.nodes ?? []).map(rawNode => ({
			name: rawNode.name,
			groupIndex: rawNode.group,
		})),
		edges: (v.Entries?.links ?? []).map(rawEdge => ({
			value: rawEdge.value,
			sourceNodeIndex: rawEdge.source,
			targetNodeIndex: rawEdge.target,
		})),
		groups: v.Entries?.groups ?? [],
	};
};

export interface FDGNode {
	name: string;
	groupIndex: number;
}

/**
 * Source and target nodes for an edge are represented by an index into the parent node set
 */
export interface FDGEdge {
	value: number;
	/** Source index into the nodes list */
	sourceNodeIndex: number;
	/** Target index into the nodes list */
	targetNodeIndex: number;
}

export interface GaugeSearchEntries extends BaseSearchEntries {
	type: 'gauge';

	// TODO
	data: Array<{
		name: string;
		magnitude: number;
		min: number;
		max: number;
	}>;
}

export const normalizeToGaugeSearchEntries = (
	v: RawSearchMessageReceivedRequestEntriesWithinRangeGaugeRenderer,
): Omit<GaugeSearchEntries, 'filter'> => {
	return {
		start: new Date(v.EntryRange.StartTS),
		end: new Date(v.EntryRange.EndTS),
		finished: v.Finished,
		type: 'gauge',
		data: (v.Entries ?? []).map(rawEntry => ({
			name: rawEntry.Name,
			magnitude: rawEntry.Magnitude,
			min: rawEntry.Min,
			max: rawEntry.Max,
		})),
	};
};

export interface HeatmapSearchEntries extends BaseSearchEntries {
	type: 'heatmap';

	// TODO
	data: Array<MapLocation & { magnitude: number | null }>;
}

export const normalizeToHeatmapSearchEntries = (
	v: RawSearchMessageReceivedRequestEntriesWithinRangeHeatmapRenderer,
): Omit<HeatmapSearchEntries, 'filter'> => {
	return {
		start: new Date(v.EntryRange.StartTS),
		end: new Date(v.EntryRange.EndTS),
		finished: v.Finished,
		type: 'heatmap',
		data: (v.Entries ?? []).map(rawEntry => ({
			latitude: rawEntry.Lat,
			longitude: rawEntry.Long,
			magnitude: rawEntry.Magnitude ?? null,
		})),
	};
};

export interface PointToPointSearchEntries extends BaseSearchEntries {
	type: 'point2point';

	// TODO
	names: Array<string>;
	data: Array<{
		source: MapLocation;
		target: MapLocation;
		magnitude: number | null;
		values: Array<string>;
	}>;
}

export const normalizeToPointToPointSearchEntries = (
	v: RawSearchMessageReceivedRequestEntriesWithinRangePointToPointRenderer,
): Omit<PointToPointSearchEntries, 'filter'> => {
	return {
		start: new Date(v.EntryRange.StartTS),
		end: new Date(v.EntryRange.EndTS),
		finished: v.Finished,
		type: 'point2point',
		names: v.ValueNames,
		data: (v.Entries ?? []).map(rawEntry => ({
			source: {
				latitude: rawEntry.Src.Lat,
				longitude: rawEntry.Src.Long,
			},
			target: {
				latitude: rawEntry.Dst.Lat,
				longitude: rawEntry.Dst.Long,
			},
			magnitude: rawEntry.Magnitude ?? null,
			values: rawEntry.Values ?? [],
		})),
	};
};

export interface PointmapSearchEntries extends BaseSearchEntries {
	type: 'pointmap';

	// TODO
	data: Array<{
		location: MapLocation;
		metadata: Array<{
			key: string;
			value: string;
		}>;
	}>;
}

export const normalizeToPointmapSearchEntries = (
	v: RawSearchMessageReceivedRequestEntriesWithinRangePointmapRenderer,
): Omit<PointmapSearchEntries, 'filter'> => {
	return {
		start: new Date(v.EntryRange.StartTS),
		end: new Date(v.EntryRange.EndTS),
		finished: v.Finished,
		type: 'pointmap',
		data: (v.Entries ?? []).map(rawEntry => ({
			location: {
				latitude: rawEntry.Loc.Lat,
				longitude: rawEntry.Loc.Long,
			},
			metadata: (rawEntry.Metadata ?? []).map(rawMeta => ({
				key: rawMeta.Key,
				value: rawMeta.Value,
			})),
		})),
	};
};

export interface MapLocation {
	latitude: number;
	longitude: number;
}

export interface RawSearchEntries extends BaseSearchEntries {
	type: 'raw';

	// TODO
	names: Array<string>;
	data: Array<SearchEntry>;
}

export const normalizeToRawSearchEntries = (
	v: RawSearchMessageReceivedRequestEntriesWithinRangeRawRenderer,
): Omit<RawSearchEntries, 'filter'> => {
	return {
		start: new Date(v.EntryRange.StartTS),
		end: new Date(v.EntryRange.EndTS),
		finished: v.Finished,
		type: 'raw',
		names: ['RAW'],
		data: (v.Entries ?? []).map(toSearchEntry),
	};
};

export interface HexSearchEntries extends BaseSearchEntries {
	// hex entries are like raw entries
	type: 'hex';

	// TODO
	names: Array<string>;
	data: Array<SearchEntry>;
}

export const normalizeToHexSearchEntries = (
	v: RawSearchMessageReceivedRequestEntriesWithinRangeHexRenderer,
): Omit<HexSearchEntries, 'filter'> => {
	return {
		start: new Date(v.EntryRange.StartTS),
		end: new Date(v.EntryRange.EndTS),
		finished: v.Finished,
		type: 'hex',
		names: ['HEX'],
		data: (v.Entries ?? []).map(toSearchEntry),
	};
};

export interface TextSearchEntries extends BaseSearchEntries {
	type: 'text';

	// TODO
	names: Array<string>;
	data: Array<SearchEntry>;
}

export const normalizeToTextSearchEntries = (
	v: RawSearchMessageReceivedRequestEntriesWithinRangeTextRenderer,
): Omit<TextSearchEntries, 'filter'> => {
	return {
		start: new Date(v.EntryRange.StartTS),
		end: new Date(v.EntryRange.EndTS),
		finished: v.Finished,
		type: 'text',
		names: ['DATA'],
		data: (v.Entries ?? []).map(toSearchEntry),
	};
};

export interface PcapSearchEntries extends BaseSearchEntries {
	// pcap entries are like text entries
	type: 'pcap';

	// TODO
	names: Array<string>;
	data: Array<SearchEntry>;
}

export const normalizeToPcapSearchEntries = (
	v: RawSearchMessageReceivedRequestEntriesWithinRangePcapRenderer,
): Omit<PcapSearchEntries, 'filter'> => {
	return {
		start: new Date(v.EntryRange.StartTS),
		end: new Date(v.EntryRange.EndTS),
		finished: v.Finished,
		type: 'pcap',
		names: ['PCAP'],
		data: (v.Entries ?? []).map(toSearchEntry),
	};
};

export interface StackGraphSearchEntries extends BaseSearchEntries {
	type: 'stackgraph';

	// TODO
	data: Array<{
		key: string;
		values: Array<{
			label: string;
			value: number;
		}>;
	}>;
}

export const normalizeToStackGraphSearchEntries = (
	v: RawSearchMessageReceivedRequestEntriesWithinRangeStackGraphRenderer,
): Omit<StackGraphSearchEntries, 'filter'> => {
	return {
		start: new Date(v.EntryRange.StartTS),
		end: new Date(v.EntryRange.EndTS),
		finished: v.Finished,
		type: 'stackgraph',
		data: (v.Entries ?? []).map(rawEntry => ({
			key: rawEntry.Key,
			values: rawEntry.Values.map(rawValue => ({
				label: rawValue.Label,
				value: rawValue.Value,
			})),
		})),
	};
};

export interface TableSearchEntries extends BaseSearchEntries {
	type: 'table';

	// TODO
	columns: Array<string>;
	rows: Array<{
		timestamp: Date;
		values: Array<string>;
	}>;
}

export const normalizeToTableSearchEntries = (
	v: RawSearchMessageReceivedRequestEntriesWithinRangeTableRenderer,
): Omit<TableSearchEntries, 'filter'> => {
	return {
		start: new Date(v.EntryRange.StartTS),
		end: new Date(v.EntryRange.EndTS),
		finished: v.Finished,
		type: 'table',
		columns: v.Entries?.Columns ?? [],
		rows: (v.Entries?.Rows ?? []).map(rawRow => ({
			timestamp: new Date(rawRow.TS),
			values: rawRow.Row,
		})),
	};
};

export interface WordcloudSearchEntries extends BaseSearchEntries {
	type: 'wordcloud';
	data: Array<{
		name: string,
		magnitude: number,
		min: number,
		max: number,
	}>
}

export const normalizeToWordcloudSearchEntries = (
	v: RawSearchMessageReceivedRequestEntriesWithinRangeWordcloudRenderer,
): Omit<WordcloudSearchEntries, 'filter'> => ({
	type: 'wordcloud',
	start: new Date(v.EntryRange.StartTS),
	end: new Date(v.EntryRange.EndTS),
	finished: v.Finished,
	data: (v.Entries ?? []).map(value => ({
		name: value.Name,
		magnitude: value.Magnitude,
		min: value.Min,
		max: value.Max,
	})),
});