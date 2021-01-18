import { ExploreResult } from '../../entries/explore';
import { SearchMessageCommands } from '../../search-message-commands';

export interface RawSearchMessageReceived_RequestEntriesWithinRange_Base {
	type: string; // Search subtype ID eg. "search2"
	data: {
		ID: SearchMessageCommands.RequestEntriesWithinRange;
		Addendum: { customView?: string };
		EntryRange: {
			First: number;
			Last: number;
			StartTS: string; // timestamp
			EndTS: string; // timestamp
		};

		AdditionalEntries: boolean;
		Finished: boolean;
		EntryCount: number;

		Explore?: Array<ExploreResult>;
	};
}
