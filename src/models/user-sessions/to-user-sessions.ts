/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawUserSessions } from './raw-user-sessions';
import { UserSessions } from './user-sessions';

export const toUserSessions = (raw: RawUserSessions): UserSessions => ({
	userID: raw.UID.toString(),
	username: raw.User,
	sessions: raw.Sessions.map(s => ({
		origin: s.Origin,
		lastHit: s.LastHit,
		isTemporary: s.TempSession,
		isSynced: s.Synced,
	})),
});
