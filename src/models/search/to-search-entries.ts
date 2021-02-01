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
	RawSearchMessageReceivedRequestEntriesWithinRangeChartRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangeFDGRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangeGaugeRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangeHeatmapRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangePointmapRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangePointToPointRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangeRawRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangeStackGraphRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangeTableRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangeTextRenderer,
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

type RawEntryNormalizer = (v: RawSearchMessageReceivedRequestEntriesWithinRange) => SearchEntries;

const NORMALIZERS: Record<SearchEntries['type'], RawEntryNormalizer> = {
	'chart': ({ data }) =>
		normalizeToChartSearchEntries(data as RawSearchMessageReceivedRequestEntriesWithinRangeChartRenderer),
	'fdg': ({ data }) =>
		normalizeToFDGSearchEntries(data as RawSearchMessageReceivedRequestEntriesWithinRangeFDGRenderer),
	'gauge': ({ data }) =>
		normalizeToGaugeSearchEntries(data as RawSearchMessageReceivedRequestEntriesWithinRangeGaugeRenderer),
	'heatmap': ({ data }) =>
		normalizeToHeatmapSearchEntries(data as RawSearchMessageReceivedRequestEntriesWithinRangeHeatmapRenderer),
	'point to point': ({ data }) =>
		normalizeToPointToPointSearchEntries(data as RawSearchMessageReceivedRequestEntriesWithinRangePointToPointRenderer),
	'pointmap': ({ data }) =>
		normalizeToPointmapSearchEntries(data as RawSearchMessageReceivedRequestEntriesWithinRangePointmapRenderer),
	'raw': ({ data }) =>
		normalizeToRawSearchEntriess(data as RawSearchMessageReceivedRequestEntriesWithinRangeRawRenderer),
	'text': ({ data }) =>
		normalizeToTextSearchEntries(data as RawSearchMessageReceivedRequestEntriesWithinRangeTextRenderer),
	'stack graph': ({ data }) =>
		normalizeToStackGraphSearchEntries(data as RawSearchMessageReceivedRequestEntriesWithinRangeStackGraphRenderer),
	'table': ({ data }) =>
		normalizeToTableSearchEntries(data as RawSearchMessageReceivedRequestEntriesWithinRangeTableRenderer),
};

export function normalize(
	renderer: 'chart',
	msg: RawSearchMessageReceivedRequestEntriesWithinRange,
): ReturnType<typeof normalizeToChartSearchEntries>;
export function normalize(
	renderer: 'fdg',
	msg: RawSearchMessageReceivedRequestEntriesWithinRange,
): ReturnType<typeof normalizeToFDGSearchEntries>;
export function normalize(
	renderer: 'gauge',
	msg: RawSearchMessageReceivedRequestEntriesWithinRange,
): ReturnType<typeof normalizeToGaugeSearchEntries>;
export function normalize(
	renderer: 'heatmap',
	msg: RawSearchMessageReceivedRequestEntriesWithinRange,
): ReturnType<typeof normalizeToHeatmapSearchEntries>;
export function normalize(
	renderer: 'point to point',
	msg: RawSearchMessageReceivedRequestEntriesWithinRange,
): ReturnType<typeof normalizeToPointToPointSearchEntries>;
export function normalize(
	renderer: 'pointmap',
	msg: RawSearchMessageReceivedRequestEntriesWithinRange,
): ReturnType<typeof normalizeToPointmapSearchEntries>;
export function normalize(
	renderer: 'raw',
	msg: RawSearchMessageReceivedRequestEntriesWithinRange,
): ReturnType<typeof normalizeToRawSearchEntriess>;
export function normalize(
	renderer: 'text',
	msg: RawSearchMessageReceivedRequestEntriesWithinRange,
): ReturnType<typeof normalizeToTextSearchEntries>;
export function normalize(
	renderer: 'stack graph',
	msg: RawSearchMessageReceivedRequestEntriesWithinRange,
): ReturnType<typeof normalizeToStackGraphSearchEntries>;
export function normalize(
	renderer: 'table',
	msg: RawSearchMessageReceivedRequestEntriesWithinRange,
): ReturnType<typeof normalizeToTableSearchEntries>;
export function normalize(
	renderer: SearchEntries['type'],
	msg: RawSearchMessageReceivedRequestEntriesWithinRange,
): SearchEntries {
	const normalizer = NORMALIZERS[renderer];
	if (isUndefined(normalizer)) {
		throw Error(`No such renderer type ${renderer}`);
	}

	const normalized = normalizer(msg);
	if (isNull(normalized)) {
		throw Error(`Bad match between renderer type "${renderer}" and message "${JSON.stringify(msg)}".`);
	}

	return normalized;
}

export const toSearchEntries = (
	renderer: string,
	msg: RawSearchMessageReceivedRequestEntriesWithinRange,
): SearchEntries => {
	const normalizer = NORMALIZERS[renderer as SearchEntries['type']];
	if (isUndefined(normalizer)) {
		throw Error(`No such renderer type ${renderer}`);
	}

	const normalized = normalizer(msg);
	if (isNull(normalized)) {
		throw Error(`Bad match between renderer type "${renderer}" and message "${JSON.stringify(msg)}".`);
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
