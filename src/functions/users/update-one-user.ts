/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isNull, isString, isUndefined, negate } from 'lodash';
import { isValidUserRole, UpdatableUser, User } from '~/models';
import { isNumericID } from '../../value-objects';
import { makeUpdateOneUserSearchGroup } from '../search-groups/update-one-user-search-group';
import { APIContext } from '../utils';
import { makeGetOneUser } from './get-one-user';
import { makeUpdateOneUserInformation } from './update-one-user-information';
import { makeUpdateOneUserLockedState } from './update-one-user-locked-state';
import { makeUpdateOneUserPassword } from './update-one-user-password';
import { makeUpdateOneUserRole } from './update-one-user-role';

export const makeUpdateOneUser = (context: APIContext) => {
	const updateOneUserLockedState = makeUpdateOneUserLockedState(context);
	const updateOneUserInformation = makeUpdateOneUserInformation(context);
	const updateOneUserRole = makeUpdateOneUserRole(context);
	const updateOneUserPassword = makeUpdateOneUserPassword(context);
	const getOneUser = makeGetOneUser(context);
	const updateOneUserSearchGroup = makeUpdateOneUserSearchGroup(context);

	return async (data: UpdatableUser): Promise<User> => {
		try {
			const promises: Array<Promise<void>> = [];

			// Update .locked
			if (isBoolean(data.locked)) promises.push(updateOneUserLockedState(data.id, data.locked));

			// Update .role
			if (isValidUserRole(data.role)) promises.push(updateOneUserRole(data.id, data.role));

			// Update .username .name or .email
			if ([data.username, data.name, data.email].some(negate(isUndefined)))
				promises.push(updateOneUserInformation(data));

			// Update password
			if (isString(data.password)) promises.push(updateOneUserPassword(data.id, data.password, data.currentPassword));

			// Search group ID
			if (isNumericID(data.searchGroupID) || isNull(data.searchGroupID))
				promises.push(updateOneUserSearchGroup(data.id, data.searchGroupID));

			await Promise.all(promises);
			return await getOneUser(data.id);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};
