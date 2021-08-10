/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isArray, isNumber, isString } from 'lodash';
import { RawSearchMessageReceivedRequestEntriesWithinRangeBaseData } from './base';

export interface RawSearchMessageReceivedRequestEntriesWithinRangeFDGRenderer
	extends RawSearchMessageReceivedRequestEntriesWithinRangeBaseData {
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
	/** Source index into the nodes list */
	source: number;
	/** Target index into the nodes list */
	target: number;
}

export const isRawSearchMessageReceivedRequestEntriesWithinRangeFDGRenderer = (
	v: RawSearchMessageReceivedRequestEntriesWithinRangeBaseData,
): v is RawSearchMessageReceivedRequestEntriesWithinRangeFDGRenderer => {
	try {
		const f = v as RawSearchMessageReceivedRequestEntriesWithinRangeFDGRenderer;
		return isRawFDGEntries(f.Entries);
	} catch {
		return false;
	}
};

const isRawFDGEntries = (v: unknown): v is RawFDGEntries => {
	try {
		const f = v as RawFDGEntries;
		return (
			isArray(f.nodes) &&
			f.nodes.every(isRawFDGNode) &&
			isArray(f.links) &&
			f.links.every(isRawFDGEdge) &&
			isArray(f.groups) &&
			f.groups.every(isString)
		);
	} catch {
		return false;
	}
};

const isRawFDGNode = (v: unknown): v is RawFDGNode => {
	try {
		const f = v as RawFDGNode;
		return isString(f.name) && isNumber(f.group);
	} catch {
		return false;
	}
};

const isRawFDGEdge = (v: unknown): v is RawFDGEdge => {
	try {
		const f = v as RawFDGEdge;
		return isNumber(f.value) && isNumber(f.source) && isNumber(f.target);
	} catch {
		return false;
	}
};
