/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export interface RawSearch {
	UID: number;
	GID: number; // zero is undefined
	UserQuery: string;
	EffectiveQuery: string;
	Launched: string; // Timestamp eg. '2020-08-07T20:42:32.981542Z'
}
