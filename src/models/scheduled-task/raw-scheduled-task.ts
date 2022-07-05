/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawNumericID, RawUUID } from '~/value-objects';

export interface RawScheduledTask {
	ID: RawNumericID;
	GUID: RawUUID;

	Owner: RawNumericID;
	Groups: Array<RawNumericID> | null;
	Global: boolean;

	Name: string;
	Description: string;
	Labels: Array<string> | null;

	/**
	 * Boolean which, if set to true, will cause the scheduled search to run once
	 * as soon as possible, unless disabled.
	 */
	OneShot: boolean;
	/**
	 * Boolean which, if set to true, will prevent the scheduled search from
	 * running.
	 */
	Disabled: boolean;

	Updated: string; // Timestamp

	/**
	 * Any error resulting from the last run of this search.
	 */
	LastError: string; // empty string is null
	/**
	 * Time at which this scheduled search last ran.
	 */
	LastRun: string; // Timestamp
	/**
	 * How long the last run took.
	 */
	LastRunDuration: number;
	/**
	 * Search IDs of the most recently performed searches from this scheduled
	 * search.
	 */
	LastSearchIDs: null;

	Timezone: string; //empty string is null

	/**
	 * Cron-compatible string specifying when to run.
	 */
	Schedule: string; // cron job format

	// *START - Standard search properties
	/**
	 * Gravwell query to execute.
	 */
	SearchString: string; //empty string is null
	/**
	 * Value in seconds specifying how far back to run the search. This must be a
	 * negative value.
	 */
	Duration: number; // In seconds, displayed in the GUI as human friendly "Timeframe"
	/**
	 * Boolean which, if set to true, will ignore the Duration field and the
	 * search will instead run from the LastRun time to the present.
	 */
	SearchSinceLastRun: boolean;
	// *END - Standard search properties

	// *START - Script search properties
	/**
	 * String containing an anko script.
	 */
	Script: string; // empty string is null
	DebugMode: boolean;
	/**
	 * Base64 string of debug output.
	 */
	DebugOutput: null;
	// *END - Script search properties

	/**
	 * 64-bit integer used to store permission bits.
	 *
	 * ?QUESTION: Is that still in use? How would it be used?
	 */
	Permissions: 0;

	/**
	 * ?QUESTION: What is this? Couldn't find it being used in the GUI and the
	 * docs don't mention what it does.
	 */
	PersistentMaps: {};
}
