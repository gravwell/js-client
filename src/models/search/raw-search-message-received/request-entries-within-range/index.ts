/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawSearchMessageReceivedRequestEntriesWithinRangeChartRenderer } from './chart-renderer';
import { RawSearchMessageReceivedRequestEntriesWithinRangeGaugeRenderer } from './gauge-renderer';
import { RawSearchMessageReceivedRequestEntriesWithinRangeHeatmapRenderer } from './heatmap-renderer';
import { RawSearchMessageReceivedRequestEntriesWithinRangePointToPointRenderer } from './point-to-point-renderer';
import { RawSearchMessageReceivedRequestEntriesWithinRangePointmapRenderer } from './pointmap-renderer';
import { RawSearchMessageReceivedRequestEntriesWithinRangeRawRenderer } from './raw-renderer';
import { RawSearchMessageReceivedRequestEntriesWithinRangeStackGraphRenderer } from './stack-graph-renderer';
import { RawSearchMessageReceivedRequestEntriesWithinRangeTableRenderer } from './table-renderer';
import { RawSearchMessageReceivedRequestEntriesWithinRangeTextRenderer } from './text-renderer';

export type RawSearchMessageReceivedRequestEntriesWithinRangeData =
	| RawSearchMessageReceivedRequestEntriesWithinRangeChartRenderer
	| RawSearchMessageReceivedRequestEntriesWithinRangeGaugeRenderer
	| RawSearchMessageReceivedRequestEntriesWithinRangeHeatmapRenderer
	| RawSearchMessageReceivedRequestEntriesWithinRangePointToPointRenderer
	| RawSearchMessageReceivedRequestEntriesWithinRangePointmapRenderer
	| RawSearchMessageReceivedRequestEntriesWithinRangeRawRenderer
	| RawSearchMessageReceivedRequestEntriesWithinRangeStackGraphRenderer
	| RawSearchMessageReceivedRequestEntriesWithinRangeTableRenderer
	| RawSearchMessageReceivedRequestEntriesWithinRangeTextRenderer;

export interface RawSearchMessageReceivedRequestEntriesWithinRange {
	type: string; // Search subtype ID eg. "search2"
	data: RawSearchMessageReceivedRequestEntriesWithinRangeData;
}

export * from './chart-renderer';
export * from './gauge-renderer';
export * from './heatmap-renderer';
export * from './point-to-point-renderer';
export * from './pointmap-renderer';
export * from './raw-renderer';
export * from './stack-graph-renderer';
export * from './table-renderer';
export * from './text-renderer';
