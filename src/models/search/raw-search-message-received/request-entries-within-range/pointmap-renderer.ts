/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isArray, isNumber, isString, isUndefined } from 'lodash';
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

export const isRawMapLocation = (v: unknown): v is RawMapLocation => {
	try {
		const l = v as RawMapLocation;
		return isNumber(l.Lat) && isNumber(l.Long);
	} catch {
		return false;
	}
};

export const isRawSearchMessageReceivedRequestEntriesWithinRangePointmapRenderer = (
	v: RawSearchMessageReceivedRequestEntriesWithinRangeBaseData,
): v is RawSearchMessageReceivedRequestEntriesWithinRangePointmapRenderer => {
	try {
		const p = v as RawSearchMessageReceivedRequestEntriesWithinRangePointmapRenderer;
		return isUndefined(p.Entries) || (isArray(p.Entries) && p.Entries.every(isRawPointmapEntries));
	} catch {
		return false;
	}
};

const isRawPointmapMetadata = (v: unknown): v is RawPointmapMetadata => {
	try {
		const p = v as RawPointmapMetadata;
		return isString(p.Key) && isString(p.Value);
	} catch {
		return false;
	}
};

const isRawPointmapEntries = (v: unknown): v is RawPointmapEntries => {
	try {
		const p = v as RawPointmapEntries;
		const metadataOK = isUndefined(p.Metadata) || (isArray(p.Metadata) && p.Metadata.every(isRawPointmapMetadata));
		return isRawMapLocation(p.Loc) && metadataOK;
	} catch {
		return false;
	}
};
