/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isArray, isUndefined } from 'lodash';
import { isRawSearchEntry, RawSearchEntry } from '../../raw-search-entry';
import { RawSearchMessageReceivedRequestEntriesWithinRangeBaseData } from './base';

export interface RawSearchMessageReceivedRequestEntriesWithinRangePcapRenderer
	extends RawSearchMessageReceivedRequestEntriesWithinRangeBaseData {
	Entries?: Array<RawSearchEntry>;
}

export const isRawSearchMessageReceivedRequestEntriesWithinRangePcapRenderer = (
	v: RawSearchMessageReceivedRequestEntriesWithinRangeBaseData,
): v is RawSearchMessageReceivedRequestEntriesWithinRangePcapRenderer => {
	try {
		const t = v as RawSearchMessageReceivedRequestEntriesWithinRangePcapRenderer;
		return isUndefined(t.Entries) || (isArray(t.Entries) && t.Entries.every(isRawSearchEntry));
	} catch {
		return false;
	}
};
