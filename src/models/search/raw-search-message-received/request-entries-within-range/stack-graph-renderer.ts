/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isArray, isNumber, isString } from 'lodash';
import { RawSearchMessageReceivedRequestEntriesWithinRangeBaseData } from './base';

export interface RawSearchMessageReceivedRequestEntriesWithinRangeStackGraphRenderer
	extends RawSearchMessageReceivedRequestEntriesWithinRangeBaseData {
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

export const isRawSearchMessageReceivedRequestEntriesWithinRangeStackGraphRenderer = (
	v: RawSearchMessageReceivedRequestEntriesWithinRangeBaseData,
): v is RawSearchMessageReceivedRequestEntriesWithinRangeStackGraphRenderer => {
	try {
		const s = v as RawSearchMessageReceivedRequestEntriesWithinRangeStackGraphRenderer;
		return isArray(s.Entries) && s.Entries.every(isRawStackGraphEntries);
	} catch {
		return false;
	}
};

const isRawStackGraphEntries = (v: unknown): v is RawStackGraphEntries => {
	try {
		const s = v as RawStackGraphEntries;
		return isString(s.Key) && s.Values.every(isRawStackGraphValue);
	} catch {
		return false;
	}
};

const isRawStackGraphValue = (v: unknown): v is RawStackGraphValue => {
	try {
		const s = v as RawStackGraphValue;
		return isString(s.Label) && isNumber(s.Value);
	} catch {
		return false;
	}
};
