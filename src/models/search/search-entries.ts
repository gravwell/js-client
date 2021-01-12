/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

// TODO: Add render module to entries observable
export interface SearchEntries {
	start: Date;
	end: Date;

	names: Array<string>;
	data: Array<{
		timestamp: Date;
		values: Array<string | number | null>;
	}>;
}
