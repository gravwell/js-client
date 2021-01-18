/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawSearchMessageReceivedRequestEntriesWithinRangeBaseData } from './base';
import { RawMapLocation } from './pointmap-renderer';

export interface RawSearchMessageReceivedRequestEntriesWithinRangeHeatmapRenderer
	extends RawSearchMessageReceivedRequestEntriesWithinRangeBaseData {
	Entries?: Array<RawHeatmapEntries>;
}

// Named HeatmapValue in Go
export interface RawHeatmapEntries extends RawMapLocation {
	Magnitude?: number;
}
