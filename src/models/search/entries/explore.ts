/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isArray, isString, isUndefined } from 'lodash';

// An Element is an item which has been extracted from an entry using the
// data exploration system.
export interface ExploreElement {
	Name: string;
	Path: string;
	Value: any;
	SubElements?: Array<ExploreElement>;
	Filters: Array<string>;
}

const isExploreElement = (v: unknown): v is ExploreElement => {
	try {
		const c = v as ExploreElement;
		const subElementsOK = isUndefined(c.SubElements)
			? true
			: isArray(c.SubElements) && c.SubElements.every(isExploreElement);
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

export interface ExploreResult {
	Elements: Array<ExploreElement>;
	Module: string;
	Tag: string;
}

export const isExploreResult = (v: unknown): v is ExploreResult => {
	try {
		const c = v as ExploreResult;
		return isArray(c.Elements) && c.Elements.every(isExploreElement) && isString(c.Module) && isString(c.Tag);
	} catch {
		return false;
	}
};
