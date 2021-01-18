/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawSearchMessageReceived_RequestEntriesWithinRange_BaseData } from './base';

export interface RawSearchMessageReceived_RequestEntriesWithinRange_StackGraphRenderer
	extends RawSearchMessageReceived_RequestEntriesWithinRange_BaseData {
	Entries: Array<RawStackGraphEntries>;
}

// Named StackGraphSet in Go
export interface RawStackGraphEntries {
	Key: string;
	Values: Array<RawStackGraphValue>;
}

// Named StackGraphValue in Go
export interface RawStackGraphValue {
	Label: string;
	Value: number;
}
