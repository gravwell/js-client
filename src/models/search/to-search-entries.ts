/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
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
	RawSearchMessageReceivedRequestEntriesWithinRangeHexRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangePcapRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangePointmapRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangePointToPointRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangeRawRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangeStackGraphRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangeTableRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangeTextRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRangeWordcloudRenderer,
	RawSearchMessageReceivedRequestExplorerEntriesWithinRange,
} from './raw-search-message-received';
import {
	normalizeToChartSearchEntries,
	normalizeToFDGSearchEntries,
	normalizeToGaugeSearchEntries,
	normalizeToHeatmapSearchEntries,
	normalizeToHexSearchEntries,
	normalizeToPcapSearchEntries,
	normalizeToPointmapSearchEntries,
	normalizeToPointToPointSearchEntries,
	normalizeToRawSearchEntries,
	normalizeToStackGraphSearchEntries,
	normalizeToTableSearchEntries,
	normalizeToTextSearchEntries,
	normalizeToWordcloudSearchEntries,
	SearchEntries,
} from './search-entries';

type RawEntryNormalizer = (
	v: RawSearchMessageReceivedRequestEntriesWithinRange | RawSearchMessageReceivedRequestExplorerEntriesWithinRange,
) => Omit<SearchEntries, 'filter'>;

const NORMALIZERS: Record<SearchEntries['type'], RawEntryNormalizer> = {
	chart: ({ data }) =>
		normalizeToChartSearchEntries(data as RawSearchMessageReceivedRequestEntriesWithinRangeChartRenderer),
	fdg: ({ data }) => normalizeToFDGSearchEntries(data as RawSearchMessageReceivedRequestEntriesWithinRangeFDGRenderer),
	gauge: ({ data }) =>
		normalizeToGaugeSearchEntries(data as RawSearchMessageReceivedRequestEntriesWithinRangeGaugeRenderer),
	heatmap: ({ data }) =>
		normalizeToHeatmapSearchEntries(data as RawSearchMessageReceivedRequestEntriesWithinRangeHeatmapRenderer),
	point2point: ({ data }) =>
		normalizeToPointToPointSearchEntries(data as RawSearchMessageReceivedRequestEntriesWithinRangePointToPointRenderer),
	pointmap: ({ data }) =>
		normalizeToPointmapSearchEntries(data as RawSearchMessageReceivedRequestEntriesWithinRangePointmapRenderer),
	raw: ({ data }) => normalizeToRawSearchEntries(data as RawSearchMessageReceivedRequestEntriesWithinRangeRawRenderer),
	wordcloud: ({ data }) =>
		normalizeToWordcloudSearchEntries(data as RawSearchMessageReceivedRequestEntriesWithinRangeWordcloudRenderer),
	text: ({ data }) =>
		normalizeToTextSearchEntries(data as RawSearchMessageReceivedRequestEntriesWithinRangeTextRenderer),
	stackgraph: ({ data }) =>
		normalizeToStackGraphSearchEntries(data as RawSearchMessageReceivedRequestEntriesWithinRangeStackGraphRenderer),
	table: ({ data }) =>
		normalizeToTableSearchEntries(data as RawSearchMessageReceivedRequestEntriesWithinRangeTableRenderer),
	// hex entries are raw entries
	hex: ({ data }) => normalizeToHexSearchEntries(data as RawSearchMessageReceivedRequestEntriesWithinRangeHexRenderer),
	// pcap entries are text entries
	pcap: ({ data }) =>
		normalizeToPcapSearchEntries(data as RawSearchMessageReceivedRequestEntriesWithinRangePcapRenderer),
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
	renderer: 'point2point',
	msg: RawSearchMessageReceivedRequestEntriesWithinRange,
): ReturnType<typeof normalizeToPointToPointSearchEntries>;
export function normalize(
	renderer: 'pointmap',
	msg: RawSearchMessageReceivedRequestEntriesWithinRange,
): ReturnType<typeof normalizeToPointmapSearchEntries>;
export function normalize(
	renderer: 'raw',
	msg: RawSearchMessageReceivedRequestEntriesWithinRange,
): ReturnType<typeof normalizeToRawSearchEntries>;
export function normalize(
	renderer: 'text',
	msg: RawSearchMessageReceivedRequestEntriesWithinRange,
): ReturnType<typeof normalizeToTextSearchEntries>;
export function normalize(
	renderer: 'stackgraph',
	msg: RawSearchMessageReceivedRequestEntriesWithinRange,
): ReturnType<typeof normalizeToStackGraphSearchEntries>;
export function normalize(
	renderer: 'table',
	msg: RawSearchMessageReceivedRequestEntriesWithinRange,
): ReturnType<typeof normalizeToTableSearchEntries>;
// hex entries are raw entries
export function normalize(
	renderer: 'hex',
	msg: RawSearchMessageReceivedRequestEntriesWithinRange,
): ReturnType<typeof normalizeToHexSearchEntries>;
// pcap entries are text entries
export function normalize(
	renderer: 'pcap',
	msg: RawSearchMessageReceivedRequestEntriesWithinRange,
): ReturnType<typeof normalizeToPcapSearchEntries>;
export function normalize(
	renderer: SearchEntries['type'],
	msg: RawSearchMessageReceivedRequestEntriesWithinRange,
): Omit<SearchEntries, 'filter'> {
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
	msg: RawSearchMessageReceivedRequestEntriesWithinRange | RawSearchMessageReceivedRequestExplorerEntriesWithinRange,
): Omit<SearchEntries, 'filter'> => {
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
 * Warning: Search messages received from the backend are often too similar to differentiate. Use
 * this function with caution.
 *
 * @param msg : the value to inspect
 *
 * @throws an error if it wasn't possible to determine the SearchEntries type
 */
export const inferSearchEntries = (
	msg: RawSearchMessageReceivedRequestEntriesWithinRange,
): Omit<SearchEntries, 'filter'> => {
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
		return normalizeToRawSearchEntries(msgData);
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
