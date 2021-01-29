/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNull, isUndefined } from 'lodash';
import {
	isRawSearchMessageReceivedRequestEntriesWithinRangeChartRenderer,
	isRawSearchMessageReceivedRequestEntriesWithinRangeFDGRenderer,
	isRawSearchMessageReceivedRequestEntriesWithinRangeGaugeRenderer,
	isRawSearchMessageReceivedRequestEntriesWithinRangeHeatmapRenderer,
	isRawSearchMessageReceivedRequestEntriesWithinRangePointmapRenderer,
	isRawSearchMessageReceivedRequestEntriesWithinRangePointToPointRenderer,
	isRawSearchMessageReceivedRequestEntriesWithinRangeRawRenderer,
	isRawSearchMessageReceivedRequestEntriesWithinRangeStackGraphRenderer,
	isRawSearchMessageReceivedRequestEntriesWithinRangeTableRenderer,
	isRawSearchMessageReceivedRequestEntriesWithinRangeTextRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRange,
} from './raw-search-message-received';
import {
	normalizeToChartSearchEntries,
	normalizeToFDGSearchEntries,
	normalizeToGaugeSearchEntries,
	normalizeToHeatmapSearchEntries,
	normalizeToPointmapSearchEntries,
	normalizeToPointToPointSearchEntries,
	normalizeToRawSearchEntriess,
	normalizeToStackGraphSearchEntries,
	normalizeToTableSearchEntries,
	normalizeToTextSearchEntries,
	SearchEntries,
} from './search-entries';

type RawEntryNormalizer = (v: RawSearchMessageReceivedRequestEntriesWithinRange) => SearchEntries | null;

const NORMALIZERS: Record<SearchEntries['type'], RawEntryNormalizer> = {
	'chart': ({ data }) =>
		isRawSearchMessageReceivedRequestEntriesWithinRangeChartRenderer(data) ? normalizeToChartSearchEntries(data) : null,

	'fdg': ({ data }) =>
		isRawSearchMessageReceivedRequestEntriesWithinRangeFDGRenderer(data) ? normalizeToFDGSearchEntries(data) : null,

	'gauge': ({ data }) =>
		isRawSearchMessageReceivedRequestEntriesWithinRangeGaugeRenderer(data) ? normalizeToGaugeSearchEntries(data) : null,

	'heatmap': ({ data }) =>
		isRawSearchMessageReceivedRequestEntriesWithinRangeHeatmapRenderer(data)
			? normalizeToHeatmapSearchEntries(data)
			: null,

	'point to point': ({ data }) =>
		isRawSearchMessageReceivedRequestEntriesWithinRangePointToPointRenderer(data)
			? normalizeToPointToPointSearchEntries(data)
			: null,

	'pointmap': ({ data }) =>
		isRawSearchMessageReceivedRequestEntriesWithinRangePointmapRenderer(data)
			? normalizeToPointmapSearchEntries(data)
			: null,

	'raw': ({ data }) =>
		isRawSearchMessageReceivedRequestEntriesWithinRangeRawRenderer(data) ? normalizeToRawSearchEntriess(data) : null,

	'text': ({ data }) =>
		isRawSearchMessageReceivedRequestEntriesWithinRangeTextRenderer(data) ? normalizeToTextSearchEntries(data) : null,

	'stack graph': ({ data }) =>
		isRawSearchMessageReceivedRequestEntriesWithinRangeStackGraphRenderer(data)
			? normalizeToStackGraphSearchEntries(data)
			: null,

	'table': ({ data }) =>
		isRawSearchMessageReceivedRequestEntriesWithinRangeTableRenderer(data) ? normalizeToTableSearchEntries(data) : null,
};

export const toSearchEntries = (
	rendererType: string,
	msg: RawSearchMessageReceivedRequestEntriesWithinRange,
): SearchEntries => {
	const normalizer = NORMALIZERS[rendererType as SearchEntries['type']];
	if (isUndefined(normalizer)) {
		throw Error(`No such renderer type ${rendererType}`);
	}

	const normalized = normalizer(msg);
	if (isNull(normalized)) {
		throw Error(`Bad match between renderer type "${rendererType}" and message "${JSON.stringify(msg)}".`);
	}

	return normalized;
};

/** Attempts to determine the type of a search entry by inspecting the members of the msg
 *
 * @param msg : the value to inspect
 *
 * @throws an error if it wasn't possible to determine the SearchEntries type
 */
export const inferSearchEntries = (msg: RawSearchMessageReceivedRequestEntriesWithinRange): SearchEntries => {
	const msgData = msg.data;
	if (isRawSearchMessageReceivedRequestEntriesWithinRangeChartRenderer(msgData)) {
		return normalizeToChartSearchEntries(msgData);
	} else if (isRawSearchMessageReceivedRequestEntriesWithinRangeFDGRenderer(msgData)) {
		return normalizeToFDGSearchEntries(msgData);
	} else if (isRawSearchMessageReceivedRequestEntriesWithinRangeGaugeRenderer(msgData)) {
		return normalizeToGaugeSearchEntries(msgData);
	} else if (isRawSearchMessageReceivedRequestEntriesWithinRangeHeatmapRenderer(msgData)) {
		return normalizeToHeatmapSearchEntries(msgData);
	} else if (isRawSearchMessageReceivedRequestEntriesWithinRangePointmapRenderer(msgData)) {
		return normalizeToPointmapSearchEntries(msgData);
	} else if (isRawSearchMessageReceivedRequestEntriesWithinRangePointToPointRenderer(msgData)) {
		return normalizeToPointToPointSearchEntries(msgData);
	} else if (isRawSearchMessageReceivedRequestEntriesWithinRangeRawRenderer(msgData)) {
		return normalizeToRawSearchEntriess(msgData);
	} else if (isRawSearchMessageReceivedRequestEntriesWithinRangeTextRenderer(msgData)) {
		return normalizeToTextSearchEntries(msgData);
	} else if (isRawSearchMessageReceivedRequestEntriesWithinRangeStackGraphRenderer(msgData)) {
		return normalizeToStackGraphSearchEntries(msgData);
	} else if (isRawSearchMessageReceivedRequestEntriesWithinRangeTableRenderer(msgData)) {
		return normalizeToTableSearchEntries(msgData);
	} else {
		throw Error(`Unable to identify SearchEntries type for ${JSON.stringify(msg)}`);
	}
};
