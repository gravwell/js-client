/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawDataExplorerResult } from '../../raw-data-explorer-result';
import { SearchMessageCommands } from '../../search-message-commands';

export interface RawSearchMessageReceivedRequestEntriesWithinRangeBaseData {
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

	Explore?: Array<RawDataExplorerResult>;
}
