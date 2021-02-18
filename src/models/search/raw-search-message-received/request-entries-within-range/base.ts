/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawJSON } from '~/value-objects';
import { RawDataExplorerEntry } from '../../raw-data-explorer-entry';
import { SearchMessageCommands } from '../../search-message-commands';

export interface RawSearchMessageReceivedRequestEntriesWithinRangeBaseData {
	ID: SearchMessageCommands.RequestEntriesWithinRange;
	Addendum?: RawJSON;
	EntryRange: {
		First: number;
		Last: number;
		StartTS: string; // timestamp
		EndTS: string; // timestamp
	};

	AdditionalEntries: boolean;
	Finished: boolean;
	EntryCount: number;

	Explore?: Array<RawDataExplorerEntry>;
}
