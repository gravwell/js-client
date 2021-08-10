/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export interface CreatableMultiLineEntry {
	/**
	 * The string tag to be used (e.g. "syslog")
	 */
	tag: string;

	/**
	 *  The lines to be ingested
	 */
	data: string;

	/**
	 * Setting this to "true" will force entries to be ingested with the current timestamp rather than attempting to parse one from each entry.
	 */
	skipTimestampParsing?: boolean;

	/**
	 * Setting this to "true" means timestamps extracted from entries will assume to be in the local timezone (instead of UTC) if the timezone is not explicitly specified.
	 */
	assumeLocalTimezone?: boolean;
}
