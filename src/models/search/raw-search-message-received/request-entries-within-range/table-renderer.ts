/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isArray, isString } from 'lodash';
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

export const isRawSearchMessageReceivedRequestEntriesWithinRangeTableRenderer = (
	v: RawSearchMessageReceivedRequestEntriesWithinRangeBaseData,
): v is RawSearchMessageReceivedRequestEntriesWithinRangeTableRenderer => {
	try {
		const t = v as RawSearchMessageReceivedRequestEntriesWithinRangeTableRenderer;
		return isRawTableEntries(t.Entries);
	} catch {
		return false;
	}
};

const isRawTableEntries = (v: unknown): v is RawTableEntries => {
	try {
		const t = v as RawTableEntries;
		return isArray(t.Columns) && t.Columns.every(isString) && isArray(t.Rows) && t.Rows.every(isRawTableRow);
	} catch {
		return false;
	}
};

const isRawTableRow = (v: unknown): v is RawTableRow => {
	try {
		const t = v as RawTableRow;
		return isString(t.TS) && t.Row.every(isString);
	} catch {
		return false;
	}
};
