/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawSearchMessageReceivedRequestEntriesWithinRangeChartRenderer } from './chart-renderer';
import { RawSearchMessageReceivedRequestEntriesWithinRangeFDGRenderer } from './fdg-renderer';
import { RawSearchMessageReceivedRequestEntriesWithinRangeGaugeRenderer } from './gauge-renderer';
import { RawSearchMessageReceivedRequestEntriesWithinRangeHeatmapRenderer } from './heatmap-renderer';
import { RawSearchMessageReceivedRequestEntriesWithinRangeHexRenderer } from './hex-renderer';
import { RawSearchMessageReceivedRequestEntriesWithinRangePcapRenderer } from './pcap-renderer';
import { RawSearchMessageReceivedRequestEntriesWithinRangePointToPointRenderer } from './point-to-point-renderer';
import { RawSearchMessageReceivedRequestEntriesWithinRangePointmapRenderer } from './pointmap-renderer';
import { RawSearchMessageReceivedRequestEntriesWithinRangeRawRenderer } from './raw-renderer';
import { RawSearchMessageReceivedRequestEntriesWithinRangeStackGraphRenderer } from './stack-graph-renderer';
import { RawSearchMessageReceivedRequestEntriesWithinRangeTableRenderer } from './table-renderer';
import { RawSearchMessageReceivedRequestEntriesWithinRangeWordcloudRenderer } from './wordcloud-renderer';
import { RawSearchMessageReceivedRequestEntriesWithinRangeTextRenderer } from './text-renderer';

export type RawSearchMessageReceivedRequestEntriesWithinRangeData =
	| RawSearchMessageReceivedRequestEntriesWithinRangeChartRenderer
	| RawSearchMessageReceivedRequestEntriesWithinRangeFDGRenderer
	| RawSearchMessageReceivedRequestEntriesWithinRangeGaugeRenderer
	| RawSearchMessageReceivedRequestEntriesWithinRangeHeatmapRenderer
	| RawSearchMessageReceivedRequestEntriesWithinRangeHexRenderer
	| RawSearchMessageReceivedRequestEntriesWithinRangePcapRenderer
	| RawSearchMessageReceivedRequestEntriesWithinRangePointToPointRenderer
	| RawSearchMessageReceivedRequestEntriesWithinRangePointmapRenderer
	| RawSearchMessageReceivedRequestEntriesWithinRangeRawRenderer
	| RawSearchMessageReceivedRequestEntriesWithinRangeStackGraphRenderer
	| RawSearchMessageReceivedRequestEntriesWithinRangeTableRenderer
	| RawSearchMessageReceivedRequestEntriesWithinRangeTextRenderer
	| RawSearchMessageReceivedRequestEntriesWithinRangeWordcloudRenderer;

export interface RawSearchMessageReceivedRequestEntriesWithinRange {
	type: string; // Search subtype ID eg. "search2"
	data: RawSearchMessageReceivedRequestEntriesWithinRangeData;
}

export * from './chart-renderer';
export * from './fdg-renderer';
export * from './gauge-renderer';
export * from './heatmap-renderer';
export * from './hex-renderer';
export * from './pcap-renderer';
export * from './point-to-point-renderer';
export * from './pointmap-renderer';
export * from './raw-renderer';
export * from './stack-graph-renderer';
export * from './table-renderer';
export * from './wordcloud-renderer';
export * from './text-renderer';
