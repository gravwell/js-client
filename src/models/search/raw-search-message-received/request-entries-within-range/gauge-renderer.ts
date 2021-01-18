/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawSearchMessageReceivedRequestEntriesWithinRangeBaseData } from './base';

export interface RawSearchMessageReceivedRequestEntriesWithinRangeGaugeRenderer
	extends RawSearchMessageReceivedRequestEntriesWithinRangeBaseData {
	Entries: Array<RawGaugeEntries>;
}

// Named GaugeValue in Go
export interface RawGaugeEntries {
	Name: string;
	Magnitude: number;
	Min: number;
	Max: number;
}
