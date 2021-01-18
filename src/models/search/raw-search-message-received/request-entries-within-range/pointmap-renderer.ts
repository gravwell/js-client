/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawSearchMessageReceivedRequestEntriesWithinRangeBaseData } from './base';

export interface RawSearchMessageReceivedRequestEntriesWithinRangePointmapRenderer
	extends RawSearchMessageReceivedRequestEntriesWithinRangeBaseData {
	Entries?: Array<RawPointmapEntries>;
}

// Named PointmapValue in Go
export interface RawPointmapEntries {
	Loc: RawMapLocation;
	Metadata?: Array<RawPointmapMetadata>;
}

// Named PointmapKV in Go
export interface RawPointmapMetadata {
	Key: string;
	Value: string;
}

// Named Location in Go
export interface RawMapLocation {
	Lat: number;
	Long: number;
}
