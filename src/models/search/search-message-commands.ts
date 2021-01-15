/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export enum SEARCH_MESSAGE_COMMANDS {
	CLOSE = 0x1,
	REQUEST_ENTRY_COUNT = 0x3,
	REQUEST_DETAILS = 0x4,
	REQUEST_TAGS = 0x5,
	REQUEST_STATS_SIZE = 0x7f000001, //gets backend "size" value of stats chunks. never used
	REQUEST_STATS_WITHIN_RANGE = 0x7f000002, //gets current time range covered by stats. rarely used

	REQ_STATS_GET = 0x7f000003, //gets stats sets over all time. may be used initially
	REQ_STATS_GET_RANGE = 0x7f000004, //gets stats in a specific range
	REQ_STATS_GET_SUMMARY = 0x7f000005, //gets stats summary for entire results
	REQ_STATS_GET_LOCATION = 0x7f000006, //get current timestamp for search progress
	REQ_GET_ENTRIES = 0x10, //1048578
	REQ_STREAMING = 0x11,
	REQ_TS_RANGE = 0x12,
	TEXT_REQ_SEARCH_DETAILS = 0x01000004, //1048580
	SEARCH_CTRL_CMD_DELETE = 'delete',
	SEARCH_CTRL_CMD_ARCHIVE = 'archive',
	SEARCH_CTRL_CMD_BACKGROUND = 'background',
	SEARCH_CTRL_CMD_STATUS = 'status',
}
