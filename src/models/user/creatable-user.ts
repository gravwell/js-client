/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { UserRole } from './user';

export interface CreatableUser {
	user: string;
	password: string;
	name: string;
	email: string;
	role: UserRole;
}
