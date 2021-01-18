import { RawSearchMessageReceived_RequestEntriesWithinRange_Base } from './base';

export interface RawSearchMessageReceived_RequestEntriesWithinRange_StackGraphRenderer
	extends RawSearchMessageReceived_RequestEntriesWithinRange_Base {
	Entries: Array<RawStackGraphEntries>;
}

// Named StackGraphSet in Go
export interface RawStackGraphEntries {
	Key: string;
	Values: Array<RawStackGraphValue>;
}

// Named StackGraphValue in Go
export interface RawStackGraphValue {
	Label: string;
	Value: number;
}
