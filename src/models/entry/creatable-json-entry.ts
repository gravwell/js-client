/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export interface CreatableJSONEntry {
	/**
	 * A timestamp (e.g. "2018-02-12T11:06:44.215431364-07:00")
	 */
	timestamp?: string;

	/**
	 * The string tag to be used (e.g. "syslog")
	 */
	tag: string;

	/**
	 *  Data in string UTF-8 format
	 */
	data: string;
}
