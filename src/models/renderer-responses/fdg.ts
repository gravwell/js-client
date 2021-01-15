/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isArray, isNumber, isString } from 'lodash';
import { BaseRendererResponse } from './renderer';

export interface FDGNode {
	name: string;
	group: number;
}

const isFDGNode = (v: unknown): v is FDGNode => {
	try {
		const f = v as FDGNode;
		return isString(f.name) && isNumber(f.group);
	} catch {
		return false;
	}
};

/**
 * Source and target nodes for an edge are represented by an index into the parent node set
 */
export interface FDGEdge {
	value: number;

	/** index into the source node list */
	source: number;
	/** index into the destination node list */
	target: number;
}

const isFDGEdge = (v: unknown): v is FDGEdge => {
	try {
		const f = v as FDGEdge;
		return isNumber(f.value) && isNumber(f.source) && isNumber(f.target);
	} catch {
		return false;
	}
};

export interface FDGSet {
	nodes: Array<FDGNode>;
	links: Array<FDGEdge>;
	groups: Array<string>;
}

const isFDGSet = (v: unknown): v is FDGSet => {
	try {
		const f = v as FDGSet;
		return (
			isArray(f.nodes) &&
			f.nodes.every(isFDGNode) &&
			isArray(f.links) &&
			f.links.every(isFDGEdge) &&
			isArray(f.groups) &&
			f.groups.every(isString)
		);
	} catch {
		return false;
	}
};

export interface FdgResponse extends BaseRendererResponse {
	Entries: FDGSet;
}

export const isFdgResponse = (v: BaseRendererResponse): v is FdgResponse => {
	try {
		const f = v as FdgResponse;
		return isFDGSet(f.Entries);
	} catch {
		return false;
	}
};
