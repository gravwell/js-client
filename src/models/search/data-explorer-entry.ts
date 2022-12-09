/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isArray, isBoolean, isNull, isNumber, isString } from 'lodash';
import { ElementFilterOperation, isElementFilterOperation } from './element-filter-operation';

export interface DataExplorerEntry {
	tag: string;
	elements: Array<DataExplorerElement>;
}

export const isDataExplorerEntry = (v: unknown): v is DataExplorerEntry => {
	try {
		const entry = v as DataExplorerEntry;
		const elementsOK = isArray(entry.elements) && entry.elements.every(isDataExplorerElement);
		return elementsOK && isString(entry.tag);
	} catch {
		return false;
	}
};

/** Item extracted from an entry using the data exploration system. */
export interface DataExplorerElement {
	module: string;
	name: string;
	path: string;
	arguments: string | null;

	value: string | number | boolean | null;
	filters: Array<ElementFilterOperation>;

	children: Array<DataExplorerElement>;
}

const isDataExplorerElement = (v: unknown): v is DataExplorerElement => {
	try {
		const element = v as DataExplorerElement;
		const childrenOK = isArray(element.children) && element.children.every(isDataExplorerElement);
		return (
			childrenOK &&
			isString(element.module) &&
			isString(element.name) &&
			isString(element.path) &&
			(isString(element.arguments) || isNull(element.arguments)) &&
			(isString(element.value) || isNumber(element.value) || isBoolean(element.value) || isNull(element.value)) &&
			isArray(element.filters) &&
			element.filters.every(isElementFilterOperation)
		);
	} catch {
		return false;
	}
};
