/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isArray, isNumber, isString, isUndefined } from 'lodash';
import { RawSearchMessageReceivedRequestEntriesWithinRangeBaseData } from './base';

export interface RawSearchMessageReceivedRequestEntriesWithinRangeChartRenderer
	extends RawSearchMessageReceivedRequestEntriesWithinRangeBaseData {
	Entries?: RawChartEntries;
}

// Named ChartableValueSet in Go
/**
 * Returned when we have a request for data.
 * The length of Names MUST BE the same length as each set of Values in each Set.
 */
export interface RawChartEntries {
	Names: string;
	KeyComps?: Array<RawChartEntriesKeyComponents>;
	Categories?: Array<string>;
	Values: Array<RawChartEntriesValue>;
}

// Named KeyComponents in Go
export interface RawChartEntriesKeyComponents {
	Keys: Array<string>;
}

// Named Chartable in Go
export interface RawChartEntriesValue {
	Data: Array<number>;
	TS: string;
}

export const isRawSearchMessageReceivedRequestEntriesWithinRangeChartRenderer = (
	v: RawSearchMessageReceivedRequestEntriesWithinRangeBaseData,
): v is RawSearchMessageReceivedRequestEntriesWithinRangeChartRenderer => {
	try {
		const x = v as RawSearchMessageReceivedRequestEntriesWithinRangeChartRenderer;
		return isRawChartEntries(x.Entries);
	} catch {
		return false;
	}
};

const isRawChartEntries = (v: unknown): v is RawChartEntries => {
	try {
		const c = v as RawChartEntries;
		const keyCompsOK = isUndefined(c.KeyComps)
			? true
			: isArray(c.KeyComps) && c.KeyComps.every(isRawChartEntriesKeyComponents);
		const categoriesOK = isUndefined(c.Categories) ? true : isArray(c.KeyComps) && c.KeyComps.every(isString);
		return (
			isString(c.Names) && keyCompsOK && categoriesOK && isArray(c.Values) && c.Values.every(isRawChartEntriesValue)
		);
	} catch {
		return false;
	}
};

const isRawChartEntriesKeyComponents = (v: unknown): v is RawChartEntriesKeyComponents => {
	try {
		const k = v as RawChartEntriesKeyComponents;
		return isArray(k.Keys) && k.Keys.every(isString);
	} catch {
		return false;
	}
};

const isRawChartEntriesValue = (v: unknown): v is RawChartEntriesValue => {
	try {
		const c = v as RawChartEntriesValue;
		return isArray(c.Data) && c.Data.every(isNumber) && isString(c.TS);
	} catch {
		return false;
	}
};
