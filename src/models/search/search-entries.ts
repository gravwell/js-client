/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

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

export interface FDGSearchEntries extends BaseSearchEntries {
	type: 'fdg';

	// TODO
	nodes: Array<FDGNode>;
	edges: Array<FDGEdge>;
	groups: Array<string>;
}

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

export interface HeatmapSearchEntries extends BaseSearchEntries {
	type: 'heatmap';

	// TODO
	data: Array<MapLocation & { magnitude: number | null }>;
}

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

export interface MapLocation {
	latitude: number;
	longitude: number;
}

export interface RawSearchEntries extends BaseSearchEntries {
	type: 'raw';

	// TODO
	names: Array<string>;
	data: Array<{
		/** IP */
		source: string;
		timestamp: Date;
		tag: string;
		value: string;

		// ?QUESTION: .Enumerated? What's that for?
		// Enumerated: Array<EnumeratedPair>;
	}>;
}

export interface TextSearchEntries extends BaseSearchEntries {
	type: 'text';

	// TODO
	names: Array<string>;
	data: Array<{
		/** IP */
		source: string;
		timestamp: Date;
		tag: string;
		value: string;

		// ?QUESTION: .Enumerated? What's that for?
		// Enumerated: Array<EnumeratedPair>;
	}>;
}

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

export interface TableSearchEntries extends BaseSearchEntries {
	type: 'table';

	// TODO
	columns: Array<string>;
	rows: Array<{
		timestamp: Date;
		values: Array<string>;
	}>;
}
