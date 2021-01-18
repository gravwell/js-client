import { RawSearchMessageReceived_RequestEntriesWithinRange_Base } from './base';

export interface RawSearchMessageReceived_RequestEntriesWithinRange_FDGRenderer
	extends RawSearchMessageReceived_RequestEntriesWithinRange_Base {
	Entries: RawFDGEntries;
}

// Named FDGSet in Go
export interface RawFDGEntries {
	nodes: Array<RawFDGNode>;
	links: Array<RawFDGEdge>;
	groups: Array<string>;
}

// Named FDGNode in Go
export interface RawFDGNode {
	name: string;
	group: number;
}

// Named FDGEdge in Go
/**
 * Source and target nodes for an edge are represented by an index into the parent node set
 */
export interface RawFDGEdge {
	value: number;

	/** index into the source node list */
	source: number;
	/** index into the destination node list */
	target: number;
}
