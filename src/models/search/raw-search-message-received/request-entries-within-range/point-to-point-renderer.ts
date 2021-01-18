import { RawSearchMessageReceived_RequestEntriesWithinRange_Base } from './base';
import { RawMapLocation } from './pointmap-renderer';

export interface RawSearchMessageReceived_RequestEntriesWithinRange_PointToPointRenderer
	extends RawSearchMessageReceived_RequestEntriesWithinRange_Base {
	ValueNames: Array<string>;
	Entries?: Array<RawPointToPointEntries>;
}

// Named P2PValue in Go
export interface RawPointToPointEntries {
	Src: RawMapLocation;
	Dst: RawMapLocation;
	Magnitude?: number;
	Values?: Array<string>;
}
