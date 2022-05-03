/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export interface RawUserSessions {
	UID: number;
	User: string;
	Sessions: Array<{
		Origin: string; // IP eg. "127.0.0.1"
		LastHit: string; // Timestamp eg. "2020-08-04T12:55:40.6312945Z"
		TempSession: boolean;
		Synced: boolean;
	}>;
}
