/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isArray, isString, isUndefined } from 'lodash';
import { FieldFilterOperation } from './search-filter';

export interface DataExplorerEntry {
	tag: string;
	module: string;
	elements: Array<DataExplorerElement>;
}

export const isDataExplorerEntry = (v: unknown): v is DataExplorerEntry => {
	try {
		const entry = v as DataExplorerEntry;
		const elementsOK = isArray(entry.elements) && entry.elements.every(isDataExplorerElement);
		return elementsOK && isString(entry.module) && isString(entry.tag);
	} catch {
		return false;
	}
};

/**
 * Item extracted from an entry using the data exploration system.
 */
export interface DataExplorerElement {
	name: string;
	path: string;

	value: any; // TODO
	filters: Array<FieldFilterOperation>;

	children: Array<DataExplorerElement>;
}

const isDataExplorerElement = (v: unknown): v is DataExplorerElement => {
	try {
		const element = v as DataExplorerElement;
		const childrenOK = isArray(element.children) && element.children.every(isDataExplorerElement);
		return (
			childrenOK &&
			isString(element.name) &&
			isString(element.path) &&
			!isUndefined(element.value) &&
			isArray(element.filters) &&
			element.filters.every(isString) // TODO: isFieldFilterOperation
		);
	} catch {
		return false;
	}
};
