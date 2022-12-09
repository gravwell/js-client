/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isArray, isNumber, isString } from 'lodash';
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

export const isRawSearchMessageReceivedRequestEntriesWithinRangeGaugeRenderer = (
	v: RawSearchMessageReceivedRequestEntriesWithinRangeBaseData,
): v is RawSearchMessageReceivedRequestEntriesWithinRangeGaugeRenderer => {
	try {
		const t = v as RawSearchMessageReceivedRequestEntriesWithinRangeGaugeRenderer;
		return isArray(t.Entries) && t.Entries.every(isRawGaugeEntries);
	} catch {
		return false;
	}
};

const isRawGaugeEntries = (v: unknown): v is RawGaugeEntries => {
	try {
		const g = v as RawGaugeEntries;
		return isString(g.Name) && isNumber(g.Magnitude) && isNumber(g.Min) && isNumber(g.Max);
	} catch {
		return false;
	}
};
