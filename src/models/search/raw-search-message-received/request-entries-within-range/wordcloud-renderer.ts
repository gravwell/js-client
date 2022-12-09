/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isArray, isNumber, isString } from 'lodash';
import { RawSearchMessageReceivedRequestEntriesWithinRangeBaseData } from './base';

export interface RawSearchMessageReceivedRequestEntriesWithinRangeWordcloudRenderer
	extends RawSearchMessageReceivedRequestEntriesWithinRangeBaseData {
	Entries: Array<RawWordcloudEntry>;
}

// Named WordcloudValueSet in Go
export interface RawWordcloudEntry {
	Name: string;
	Magnitude: number;
	Min: number;
	Max: number;
}

export const isRawSearchMessageReceivedRequestEntriesWithinRangeWordcloudRenderer = (
	v: RawSearchMessageReceivedRequestEntriesWithinRangeBaseData,
): v is RawSearchMessageReceivedRequestEntriesWithinRangeWordcloudRenderer => {
	try {
		const t = v as RawSearchMessageReceivedRequestEntriesWithinRangeWordcloudRenderer;
		return isRawWordcloudEntries(t.Entries);
	} catch {
		return false;
	}
};

const isRawWordcloudEntries = (v: unknown): v is RawWordcloudEntry => {
	try {
		const t = v as RawWordcloudEntry;
		return isArray(t) && t.every(isRawWordcloudEntry);
	} catch {
		return false;
	}
};

const isRawWordcloudEntry = (v: unknown): v is RawWordcloudEntry => {
	try {
		const t = v as RawWordcloudEntry;
		return isString(t.Name) && isNumber(t.Magnitude) && isNumber(t.Min) && isNumber(t.Max);
	} catch {
		return false;
	}
};
