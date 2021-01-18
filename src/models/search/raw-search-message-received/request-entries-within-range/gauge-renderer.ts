import { RawSearchMessageReceived_RequestEntriesWithinRange_Base } from './base';

export interface RawSearchMessageReceived_RequestEntriesWithinRange_GaugeRenderer
	extends RawSearchMessageReceived_RequestEntriesWithinRange_Base {
	Entries: Array<RawGaugeEntries>;
}

// Named GaugeValue in Go
export interface RawGaugeEntries {
	Name: string;
	Magnitude: number;
	Min: number;
	Max: number;
}
