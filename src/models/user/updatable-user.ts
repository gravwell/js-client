/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID } from '~/value-objects';
import { UserRole } from './user';

export interface UpdatableUser {
	id: NumericID;
	username?: string;
	name?: string;
	email?: string;

	password?: string;
	currentPassword?: string;

	role?: UserRole;
	locked?: boolean;

	searchGroupID?: NumericID | null;
}
