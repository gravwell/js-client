/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isArray, isNumber, isString, isUndefined } from 'lodash';
import { RawSearchMessageReceivedRequestEntriesWithinRangeBaseData } from './base';
import { isRawMapLocation, RawMapLocation } from './pointmap-renderer';

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

export const isRawSearchMessageReceivedRequestEntriesWithinRangePointToPointRenderer = (
	v: RawSearchMessageReceivedRequestEntriesWithinRangeBaseData,
): v is RawSearchMessageReceivedRequestEntriesWithinRangePointToPointRenderer => {
	try {
		const p = v as RawSearchMessageReceivedRequestEntriesWithinRangePointToPointRenderer;
		const entriesOK = isUndefined(p.Entries) || (isArray(p.Entries) && p.Entries.every(isRawPointToPointEntries));
		return isArray(p.ValueNames) && p.ValueNames.every(isString) && entriesOK;
	} catch {
		return false;
	}
};

const isRawPointToPointEntries = (v: unknown): v is RawPointToPointEntries => {
	try {
		const p = v as RawPointToPointEntries;
		const magnitudeOK = isUndefined(p.Magnitude) || isNumber(p.Magnitude);
		const valuesOK = isUndefined(p.Values) || (isArray(p.Values) && p.Values.every(isString));
		return isRawMapLocation(p.Src) && isRawMapLocation(p.Dst) && magnitudeOK && valuesOK;
	} catch {
		return false;
	}
};
