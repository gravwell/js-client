/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {
	RawSearchMessageReceivedRequestEntriesWithinRangeChartRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangeFDGRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangeGaugeRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangeHeatmapRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangePointmapRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangePointToPointRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangeRawRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangeStackGraphRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangeTableRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangeTextRenderer,
} from './raw-search-message-received';
import { SearchEntry } from './search-entry';
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
	| TableSearchEntries;

// TODO: Add render module to entries observable
export interface BaseSearchEntries {
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
): ChartSearchEntries => {
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
): FDGSearchEntries => {
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
): GaugeSearchEntries => {
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
): HeatmapSearchEntries => {
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
	type: 'point to point';

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
): PointToPointSearchEntries => {
	return {
		start: new Date(v.EntryRange.StartTS),
		end: new Date(v.EntryRange.EndTS),
		finished: v.Finished,
		type: 'point to point',
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
): PointmapSearchEntries => {
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
): RawSearchEntries => {
	return {
		start: new Date(v.EntryRange.StartTS),
		end: new Date(v.EntryRange.EndTS),
		finished: v.Finished,
		type: 'raw',
		names: ['RAW'],
		data: (v.Entries ?? []).map(toSearchEntry),
	};
};

export interface TextSearchEntries extends BaseSearchEntries {
	type: 'text';

	// TODO
	names: Array<string>;
	data: Array<{
		/** IP */
		source: string;
		timestamp: Date;
		tag: number;
		value: string;

		// ?QUESTION: .Enumerated? What's that for?
		// Enumerated: Array<EnumeratedPair>;
	}>;
}

export const normalizeToTextSearchEntries = (
	v: RawSearchMessageReceivedRequestEntriesWithinRangeTextRenderer,
): TextSearchEntries => {
	return {
		start: new Date(v.EntryRange.StartTS),
		end: new Date(v.EntryRange.EndTS),
		finished: v.Finished,
		type: 'text',
		names: ['DATA'],
		data: (v.Entries ?? []).map(rawEntry => ({
			source: rawEntry.SRC,
			timestamp: new Date(rawEntry.TS),
			tag: rawEntry.Tag,
			value: rawEntry.Data,
		})),
	};
};

export interface StackGraphSearchEntries extends BaseSearchEntries {
	type: 'stack graph';

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
): StackGraphSearchEntries => {
	return {
		start: new Date(v.EntryRange.StartTS),
		end: new Date(v.EntryRange.EndTS),
		finished: v.Finished,
		type: 'stack graph',
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
): TableSearchEntries => {
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
