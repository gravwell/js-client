import { RawSearchMessageReceived_RequestEntriesWithinRange_Base } from './base';

export interface RawSearchMessageReceived_RequestEntriesWithinRange_PointmapRenderer
	extends RawSearchMessageReceived_RequestEntriesWithinRange_Base {
	Entries?: Array<RawPointmapEntries>;
}

// Named PointmapValue in Go
export interface RawPointmapEntries {
	Loc: RawMapLocation;
	Metadata?: Array<RawPointmapMetadata>;
}

// Named PointmapKV in Go
export interface RawPointmapMetadata {
	Key: string;
	Value: string;
}

// Named Location in Go
export interface RawMapLocation {
	Lat: number;
	Long: number;
}
