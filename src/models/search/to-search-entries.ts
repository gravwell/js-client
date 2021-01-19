/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {
	isRawSearchMessageReceivedRequestEntriesWithinRangeChartRenderer,
	isRawSearchMessageReceivedRequestEntriesWithinRangeFDGRenderer,
	isRawSearchMessageReceivedRequestEntriesWithinRangeGaugeRenderer,
	isRawSearchMessageReceivedRequestEntriesWithinRangeHeatmapRenderer,
	isRawSearchMessageReceivedRequestEntriesWithinRangePointToPointRenderer,
	isRawSearchMessageReceivedRequestEntriesWithinRangeRawRenderer,
	isRawSearchMessageReceivedRequestEntriesWithinRangeStackGraphRenderer,
	isRawSearchMessageReceivedRequestEntriesWithinRangeTableRenderer,
	isRawSearchMessageReceivedRequestEntriesWithinRangeTextRenderer,
	RawSearchMessageReceivedRequestEntriesWithinRange,
} from './raw-search-message-received';
import { BaseSearchEntries, SearchEntries } from './search-entries';

export const toSearchEntries = (msg: RawSearchMessageReceivedRequestEntriesWithinRange): SearchEntries => {
	const base: BaseSearchEntries = {
		start: new Date(msg.data.EntryRange.StartTS),
		end: new Date(msg.data.EntryRange.EndTS),
	};

	const msgData = msg.data;
	if (isRawSearchMessageReceivedRequestEntriesWithinRangeChartRenderer(msgData)) {
		return {
			...base,
			type: 'chart',
			names: msgData.Entries?.Categories ?? [],
			data: (msgData.Entries?.Values ?? []).map(rawV => ({
				timestamp: new Date(rawV.TS),
				values: rawV.Data,
			})),
		};
	} else if (isRawSearchMessageReceivedRequestEntriesWithinRangeFDGRenderer(msgData)) {
		return {
			...base,
			type: 'fdg',
			nodes: (msgData.Entries?.nodes ?? []).map(rawNode => ({
				name: rawNode.name,
				groupIndex: rawNode.group,
			})),
			edges: (msgData.Entries?.links ?? []).map(rawEdge => ({
				value: rawEdge.value,
				sourceNodeIndex: rawEdge.source,
				targetNodeIndex: rawEdge.target,
			})),
			groups: msgData.Entries?.groups ?? [],
		};
	} else if (isRawSearchMessageReceivedRequestEntriesWithinRangeGaugeRenderer(msgData)) {
		return {
			...base,
			type: 'gauge',
			data: (msgData.Entries ?? []).map(rawEntry => ({
				name: rawEntry.Name,
				magnitude: rawEntry.Magnitude,
				min: rawEntry.Min,
				max: rawEntry.Max,
			})),
		};
	} else if (isRawSearchMessageReceivedRequestEntriesWithinRangeHeatmapRenderer(msgData)) {
		return {
			...base,
			type: 'heatmap',
			data: (msgData.Entries ?? []).map(rawEntry => ({
				latitude: rawEntry.Lat,
				longitude: rawEntry.Long,
				magnitude: rawEntry.Magnitude ?? null,
			})),
		};
	} else if (isRawSearchMessageReceivedRequestEntriesWithinRangePointToPointRenderer(msgData)) {
		return {
			...base,
			type: 'point to point',
			names: msgData.ValueNames,
			data: (msgData.Entries ?? []).map(rawEntry => ({
				source: {
					latitude: rawEntry.Src.Lat,
					longitude: rawEntry.Src.Long,
				},
				target: {
					latitude: rawEntry.Dst.Lat,
					longitude: rawEntry.Dst.Long,
				},
				magnitude: rawEntry.Magnitude ?? null,
				values: rawEntry.Values ?? [],
			})),
		};
	} else if (isRawSearchMessageReceivedRequestEntriesWithinRangeRawRenderer(msgData)) {
		return {
			...base,
			type: 'raw',
			names: ['RAW'],
			data: (msgData.Entries ?? []).map(rawEntry => ({
				source: rawEntry.SRC,
				timestamp: new Date(rawEntry.TS),
				tag: rawEntry.Tag,
				value: rawEntry.Data,
			})),
		};
	} else if (isRawSearchMessageReceivedRequestEntriesWithinRangeTextRenderer(msgData)) {
		return {
			...base,
			type: 'text',
			names: ['DATA'],
			data: (msgData.Entries ?? []).map(rawEntry => ({
				source: rawEntry.SRC,
				timestamp: new Date(rawEntry.TS),
				tag: rawEntry.Tag,
				value: rawEntry.Data,
			})),
		};
	} else if (isRawSearchMessageReceivedRequestEntriesWithinRangeStackGraphRenderer(msgData)) {
		return {
			...base,
			type: 'stack graph',
			data: (msgData.Entries ?? []).map(rawEntry => ({
				key: rawEntry.Key,
				values: rawEntry.Values.map(rawValue => ({
					label: rawValue.Label,
					value: rawValue.Value,
				})),
			})),
		};
	} else if (isRawSearchMessageReceivedRequestEntriesWithinRangeTableRenderer(msgData)) {
		return {
			...base,
			type: 'table',
			columns: msgData.Entries?.Columns ?? [],
			rows: (msgData.Entries?.Rows ?? []).map(rawRow => ({
				timestamp: new Date(rawRow.TS),
				values: rawRow.Row,
			})),
		};
	} else {
		// else if (isRawSearchMessageReceivedRequestEntriesWithinRangePointmapRenderer(msgData))
		return {
			...base,
			type: 'pointmap',
			data: (msgData.Entries ?? []).map(rawEntry => ({
				location: {
					latitude: rawEntry.Loc.Lat,
					longitude: rawEntry.Loc.Long,
				},
				metadata: (rawEntry.Metadata ?? []).map(rawMeta => ({
					key: rawMeta.Key,
					value: rawMeta.Value,
				})),
			})),
		};
	}
};
