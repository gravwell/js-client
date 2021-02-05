/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ID } from '~/value-objects';

export interface SearchStats {
	id: ID;
	userID: ID;

	entries: number;
	duration: string;
	start: Date;
	end: Date;

	pipeline: Array<{
		module: string;
		arguments: string;
		duration: number;
		input: {
			bytes: number;
			entries: number;
		};
		output: {
			bytes: number;
			entries: number;
		};
	}>;

	storeSize: number;
	processed: {
		entries: number;
		bytes: number;
	};
}
