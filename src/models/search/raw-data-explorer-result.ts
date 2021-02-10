/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isArray, isString, isUndefined } from 'lodash';

// Named ExploreResult in Go
export interface RawDataExplorerResult {
	Elements: Array<RawDataExplorerElement> | null;
	Module: string;
	Tag: string;
}

export const isRawDataExplorerResult = (v: unknown): v is RawDataExplorerResult => {
	try {
		const c = v as RawDataExplorerResult;
		return isArray(c.Elements) && c.Elements.every(isRawDataExplorerElement) && isString(c.Module) && isString(c.Tag);
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
	Value: any;
	SubElements?: Array<RawDataExplorerElement>;
	Filters: Array<string>;
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
