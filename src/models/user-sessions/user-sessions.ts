/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export interface UserSessions {
	userID: string;
	username: string;
	sessions: Array<{
		origin: string;
		lastHit: string;
		isTemporary: boolean;
		isSynced: boolean;
	}>;
}
