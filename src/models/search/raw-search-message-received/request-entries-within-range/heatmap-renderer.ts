/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isArray, isNumber, isUndefined } from 'lodash';
import { RawSearchMessageReceivedRequestEntriesWithinRangeBaseData } from './base';
import { isRawMapLocation, RawMapLocation } from './pointmap-renderer';

export interface RawSearchMessageReceivedRequestEntriesWithinRangeHeatmapRenderer
	extends RawSearchMessageReceivedRequestEntriesWithinRangeBaseData {
	Entries?: Array<RawHeatmapEntries>;
}

// Named HeatmapValue in Go
export interface RawHeatmapEntries extends RawMapLocation {
	Magnitude?: number;
}

export const isRawSearchMessageReceivedRequestEntriesWithinRangeHeatmapRenderer = (
	v: RawSearchMessageReceivedRequestEntriesWithinRangeBaseData,
): v is RawSearchMessageReceivedRequestEntriesWithinRangeHeatmapRenderer => {
	try {
		const p = v as RawSearchMessageReceivedRequestEntriesWithinRangeHeatmapRenderer;
		return isUndefined(p.Entries) || (isArray(p.Entries) && p.Entries.every(isRawHeatmapEntries));
	} catch {
		return false;
	}
};

const isRawHeatmapEntries = (v: unknown): v is RawHeatmapEntries => {
	try {
		const h = v as RawHeatmapEntries;
		const magnitudeOK = isUndefined(h.Magnitude) || isNumber(h.Magnitude);
		return magnitudeOK && isRawMapLocation(h);
	} catch {
		return false;
	}
};
