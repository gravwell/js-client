import { RawSearchMessageReceived_RequestEntriesWithinRange_Base } from './base';
import { RawMapLocation } from './pointmap-renderer';

export interface RawSearchMessageReceived_RequestEntriesWithinRange_HeatmapRenderer
	extends RawSearchMessageReceived_RequestEntriesWithinRange_Base {
	Entries?: Array<RawHeatmapEntries>;
}

// Named HeatmapValue in Go
export interface RawHeatmapEntries extends RawMapLocation {
	Magnitude?: number;
}
