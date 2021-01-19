/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isArray, isUndefined } from 'lodash';
import { isRawDataExplorerResult } from '../../raw-data-explorer-result';
import { isRawSearchEntry, RawSearchEntry } from '../../raw-search-entry';
import { RawSearchMessageReceivedRequestEntriesWithinRangeBaseData } from './base';

export interface RawSearchMessageReceivedRequestEntriesWithinRangeRawRenderer
	extends RawSearchMessageReceivedRequestEntriesWithinRangeBaseData {
	Entries?: Array<RawSearchEntry>;
}

export const isRawSearchMessageReceivedRequestEntriesWithinRangeRawRenderer = (
	v: RawSearchMessageReceivedRequestEntriesWithinRangeBaseData,
): v is RawSearchMessageReceivedRequestEntriesWithinRangeRawRenderer => {
	try {
		const t = v as RawSearchMessageReceivedRequestEntriesWithinRangeRawRenderer;
		const entriesOK = isUndefined(t.Entries) || (isArray(t.Entries) && t.Entries.every(isRawSearchEntry));
		const exploreOK = isUndefined(t.Entries) || (isArray(t.Explore) && t.Explore.every(isRawDataExplorerResult));
		return entriesOK && exploreOK;
	} catch {
		return false;
	}
};
