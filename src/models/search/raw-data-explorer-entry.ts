/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isArray, isNull, isString, isUndefined } from 'lodash';
import { RawFieldFilterOperation } from './search-filter';

// Named ExploreResult in Go
export interface RawDataExplorerEntry {
	Elements: Array<RawDataExplorerElement> | null;
	Module: string;
	Tag: string;
}

export const isRawDataExplorerEntry = (v: unknown): v is RawDataExplorerEntry => {
	try {
		const entry = v as RawDataExplorerEntry;
		const elementsOK =
			isNull(entry.Elements) || (isArray(entry.Elements) && entry.Elements.every(isRawDataExplorerElement));
		return elementsOK && isString(entry.Module) && isString(entry.Tag);
	} catch {
		return false;
	}
};

// Named ExploreElement in Go
/**
 * An Element is an item which has been extracted from an entry using the
 * data exploration system.
 */
export interface RawDataExplorerElement {
	Name: string;
	Path: string;
	Value: string;
	SubElements?: Array<RawDataExplorerElement>;
	Filters: Array<RawFieldFilterOperation>;
}

const isRawDataExplorerElement = (v: unknown): v is RawDataExplorerElement => {
	try {
		const c = v as RawDataExplorerElement;
		const subElementsOK = isUndefined(c.SubElements)
			? true
			: isArray(c.SubElements) && c.SubElements.every(isRawDataExplorerElement);
		return (
			isString(c.Name) &&
			isString(c.Path) &&
			!isUndefined(c.Value) &&
			subElementsOK &&
			isArray(c.Filters) &&
			c.Filters.every(isString)
		);
	} catch {
		return false;
	}
};
