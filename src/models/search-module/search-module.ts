/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export interface SearchModule {
	name: string;
	description: string;
	examples: Array<string>;

	frontendOnly: boolean;
	collapsing: boolean;
	sorting: boolean;
}
