/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawSearchMessageReceived_RequestEntriesWithinRange_ChartRenderer } from './chart-renderer';
import { RawSearchMessageReceived_RequestEntriesWithinRange_GaugeRenderer } from './gauge-renderer';
import { RawSearchMessageReceived_RequestEntriesWithinRange_HeatmapRenderer } from './heatmap-renderer';
import { RawSearchMessageReceived_RequestEntriesWithinRange_PointToPointRenderer } from './point-to-point-renderer';
import { RawSearchMessageReceived_RequestEntriesWithinRange_PointmapRenderer } from './pointmap-renderer';
import { RawSearchMessageReceived_RequestEntriesWithinRange_RawRenderer } from './raw-renderer';
import { RawSearchMessageReceived_RequestEntriesWithinRange_StackGraphRenderer } from './stack-graph-renderer';
import { RawSearchMessageReceived_RequestEntriesWithinRange_TableRenderer } from './table-renderer';
import { RawSearchMessageReceived_RequestEntriesWithinRange_TextRenderer } from './text-renderer';

export type RawSearchMessageReceived_RequestEntriesWithinRangeData =
	| RawSearchMessageReceived_RequestEntriesWithinRange_ChartRenderer
	| RawSearchMessageReceived_RequestEntriesWithinRange_GaugeRenderer
	| RawSearchMessageReceived_RequestEntriesWithinRange_HeatmapRenderer
	| RawSearchMessageReceived_RequestEntriesWithinRange_PointToPointRenderer
	| RawSearchMessageReceived_RequestEntriesWithinRange_PointmapRenderer
	| RawSearchMessageReceived_RequestEntriesWithinRange_RawRenderer
	| RawSearchMessageReceived_RequestEntriesWithinRange_StackGraphRenderer
	| RawSearchMessageReceived_RequestEntriesWithinRange_TableRenderer
	| RawSearchMessageReceived_RequestEntriesWithinRange_TextRenderer;

export interface RawSearchMessageReceived_RequestEntriesWithinRange {
	type: string; // Search subtype ID eg. "search2"
	data: RawSearchMessageReceived_RequestEntriesWithinRangeData;
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
