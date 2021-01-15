/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export enum SearchMessageCommands {
	Close = 0x1, // Named CLOSE on docs
	DeleteSearch = 'delete', // Named SEARCH_CTRL_CMD_DELETE on docs
	ArchiveSearch = 'archive', // Named SEARCH_CTRL_CMD_ARCHIVE on docs
	BackgroundSearch = 'background', // Named SEARCH_CTRL_CMD_BACKGROUND on docs
	Status = 'status', // Named SEARCH_CTRL_CMD_STATUS on docs

	RequestEntries = 0x10, // Named REQ_GET_ENTRIES on docs
	RequestEntryCount = 0x3, // Named REQUEST_ENTRY_COUNT on docs
	RequestDetails = 0x4, // Named REQUEST_DETAILS on docs
	RequestTags = 0x5, // Named REQUEST_TAGS on docs

	RequestStreaming = 0x11, // Named REQ_STREAMING on docs
	RequestTimestampRange = 0x12, // Named REQ_TS_RANGE on docs
	RequestTextSearchDetails = 0x01000004, // Named TEXT_REQ_SEARCH_DETAILS on docs

	/** Requests "size" value of stats chunks. Never used. */
	RequestStatsSize = 0x7f000001, // Named REQUEST_STATS_SIZE on docs
	/** Request current time range covered by stats. Rarely used. */
	RequestStatsWithinRange = 0x7f000002, // Named REQUEST_STATS_WITHIN_RANGE on docs
	/** Requests stats over all time. Generally used on init. */
	RequestAllStats = 0x7f000003, // Named REQ_STATS_GET on docs
	/** Requests stats in a specific range. */
	RequestStatsInRange = 0x7f000004, // Named REQ_STATS_GET_RANGE on docs
	/** Requests stats summary for entire results. */
	RequestStatsSummary = 0x7f000005, // Named REQ_STATS_GET_SUMMARY on docs
	/** Requests current timestamp for search progress */
	RequestStatsLocation = 0x7f000006, // Named REQ_STATS_GET_LOCATION on docs
}
