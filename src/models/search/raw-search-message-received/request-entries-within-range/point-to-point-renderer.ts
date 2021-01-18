/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawSearchMessageReceivedRequestEntriesWithinRangeBaseData } from './base';
import { RawMapLocation } from './pointmap-renderer';

export interface RawSearchMessageReceivedRequestEntriesWithinRangePointToPointRenderer
	extends RawSearchMessageReceivedRequestEntriesWithinRangeBaseData {
	ValueNames: Array<string>;
	Entries?: Array<RawPointToPointEntries>;
}

// Named P2PValue in Go
export interface RawPointToPointEntries {
	Src: RawMapLocation;
	Dst: RawMapLocation;
	Magnitude?: number;
	Values?: Array<string>;
}
