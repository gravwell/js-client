/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawSearchMessageReceived_RequestEntriesWithinRange_BaseData } from './base';

export interface RawSearchMessageReceived_RequestEntriesWithinRange_ChartRenderer
	extends RawSearchMessageReceived_RequestEntriesWithinRange_BaseData {
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
