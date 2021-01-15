/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isArray, isNumber, isString, isUndefined } from 'lodash';

// Named ChartableValueSet in Go
/**
 * Returned when we have a request for data.
 * The length of Names MUST BE the same length as each set of Values in each Set.
 */
export interface RawChartEntries {
	Names: string;
	KeyComps?: Array<RawChartEntriesKeyComps>;
	Categories?: Array<string>;
	Values: Array<RawChartEntriesValue>;
}

// Named KeyComponents in Go
export interface RawChartEntriesKeyComps {
	Keys: Array<string>;
}

// Named Chartable in Go
export interface RawChartEntriesValue {
	Data: Array<number>;
	TS: string;
}

export const isRawChartEntries = (v: unknown): v is RawChartEntries => {
	try {
		const c = v as RawChartEntries;
		const keyCompsOK = isUndefined(c.KeyComps)
			? true
			: isArray(c.KeyComps) && c.KeyComps.every(isRawChartEntriesKeyComps);
		const categoriesOK = isUndefined(c.Categories) ? true : isArray(c.KeyComps) && c.KeyComps.every(isString);
		return (
			isString(c.Names) && keyCompsOK && categoriesOK && isArray(c.Values) && c.Values.every(isRawChartEntriesValue)
		);
	} catch {
		return false;
	}
};

const isRawChartEntriesKeyComps = (v: unknown): v is RawChartEntriesKeyComps => {
	try {
		const k = v as RawChartEntriesKeyComps;
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
