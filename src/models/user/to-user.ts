/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNumber } from 'lodash';
import { RawUser } from './raw-user';
import { User } from './user';

export const toUser = (raw: RawUser): User => ({
	id: raw.UID.toString(),
	groupIDs: raw.Groups.map(g => g.GID.toString()),
	username: raw.User,
	name: raw.Name,
	email: raw.Email,
	role: raw.Admin ? 'admin' : 'analyst',
	locked: raw.Locked,
	searchGroupID: isNumber(raw.DefaultGID) ? raw.DefaultGID.toString() : null,
	lastActivityDate: ((): Date | null => {
		// !WARNING: If we set the TS to January 01, 0001, it means that there's no last activity date
		// I'm using 1970 to have a margin for errors
		const nullDate = new Date(10000000000);
		const date = new Date(raw.TS);
		return date.getTime() <= nullDate.getTime() ? null : date;
	})(),
});
