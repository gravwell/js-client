/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { isValidUserData } from './is-valid-user-data';
import { User, UserRole } from './user';

export const isValidUserRole = (value: any): value is UserRole =>
	(<Array<UserRole>>['admin', 'analyst']).includes(value);

export const isValidUser = (value: unknown): value is User => {
	try {
		const u = <User>value;
		return u._tag === DATA_TYPE.USER && isValidUserData(u);
	} catch {
		return false;
	}
};
