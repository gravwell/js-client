/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { User } from '../../models';
import { isNumericID, NumericID } from '../../value-objects';
import { APIContext } from '../utils';
import { makeGetAllUsers } from './get-all-users';
import { makeGetUsersByGroup } from './get-users-by-group';

export const makeGetManyUsers = (context: APIContext) => {
	const getUsersByGroup = makeGetUsersByGroup(context);
	const getAllUsers = makeGetAllUsers(context);

	return async (authToken: string | null, userFilter: { groupID?: NumericID } = {}): Promise<Array<User>> => {
		if (isNumericID(userFilter.groupID)) return getUsersByGroup(authToken, userFilter.groupID);
		return getAllUsers(authToken);
	};
};
