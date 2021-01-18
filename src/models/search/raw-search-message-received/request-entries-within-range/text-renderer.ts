import { RawSearchEntry } from '../../entries/search-entry';
import { RawSearchMessageReceived_RequestEntriesWithinRange_Base } from './base';

export interface RawSearchMessageReceived_RequestEntriesWithinRange_TextRenderer
	extends RawSearchMessageReceived_RequestEntriesWithinRange_Base {
	Entries?: Array<RawSearchEntry>;
}
