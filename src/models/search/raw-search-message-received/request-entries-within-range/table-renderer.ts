/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawSearchMessageReceivedRequestEntriesWithinRangeBaseData } from './base';

export interface RawSearchMessageReceivedRequestEntriesWithinRangeTableRenderer
	extends RawSearchMessageReceivedRequestEntriesWithinRangeBaseData {
	Entries: RawTableEntries;
}

// Named TableValueSet in Go
export interface RawTableEntries {
	Columns: Array<string>;
	Rows: Array<RawTableRow>;
}

// Named TableRow in Go
export interface RawTableRow {
	TS: string;
	Row: Array<string>;
}
