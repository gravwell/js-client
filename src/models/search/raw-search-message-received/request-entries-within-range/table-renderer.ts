import { RawSearchMessageReceived_RequestEntriesWithinRange_Base } from './base';

export interface RawSearchMessageReceived_RequestEntriesWithinRange_TableRenderer
	extends RawSearchMessageReceived_RequestEntriesWithinRange_Base {
	Entries: RawTableEntries;
}

// Named TableValueSet in Go
export interface RawTableEntries {
	Columns: Array<string>;
	Rows: Array<RawTableRow>;
}

// Named TableRow in Go
export interface RawTableRow {
	TS: string;
	Row: Array<string>;
}
