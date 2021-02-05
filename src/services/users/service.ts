/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableUser, UpdatableUser, User } from '~/models';
import { NumericID } from '~/value-objects';

export interface UsersService {
	readonly get: {
		readonly me: () => Promise<User>;
		readonly one: (userID: NumericID) => Promise<User>;
		readonly many: (filter?: { groupID?: NumericID }) => Promise<Array<User>>;
		readonly all: () => Promise<Array<User>>;
	};

	readonly create: {
		readonly one: (data: CreatableUser) => Promise<User>;
	};

	readonly update: {
		readonly me: (data: Omit<UpdatableUser, 'id'>) => Promise<User>;
		readonly one: (data: UpdatableUser) => Promise<User>;
	};

	readonly delete: {
		readonly one: (userID: NumericID) => Promise<void>;
	};
}
