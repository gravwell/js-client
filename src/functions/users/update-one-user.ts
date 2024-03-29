/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isBoolean, isEmpty, isNull, isString, isUndefined, negate } from 'lodash';
import { UpdatableUser } from '~/models/user/updatable-user';
import { User } from '~/models/user/user';
import { isNumericID } from '../../value-objects/id';
import { makeUpdateOneUserSearchGroup } from '../search-groups/update-one-user-search-group';
import { APIContext } from '../utils/api-context';
import { makeGetOneUser } from './get-one-user';
import { makeUpdateOneUserInformation } from './update-one-user-information';
import { makeUpdateOneUserLockedState } from './update-one-user-locked-state';
import { makeUpdateOneUserPassword } from './update-one-user-password';

export const makeUpdateOneUser = (context: APIContext): ((data: UpdatableUser) => Promise<User>) => {
	const updateOneUserLockedState = makeUpdateOneUserLockedState(context);
	const updateOneUserInformation = makeUpdateOneUserInformation(context);
	const updateOneUserPassword = makeUpdateOneUserPassword(context);
	const getOneUser = makeGetOneUser(context);
	const updateOneUserSearchGroup = makeUpdateOneUserSearchGroup(context);

	return async (data: UpdatableUser): Promise<User> => {
		try {
			const promises: Array<Promise<void>> = [];

			// Update .locked
			if (isBoolean(data.isLocked)) {
				promises.push(updateOneUserLockedState(data.id, data.isLocked));
			}

			// Update .username .name or .email or role
			if ([data.username, data.name, data.email, data.role].some(negate(isUndefined))) {
				promises.push(updateOneUserInformation(data));
			}

			// Update password
			if (isString(data.password) && !isEmpty(data.password)) {
				promises.push(updateOneUserPassword(data.id, data.password, data.currentPassword));
			}

			// Search group ID
			if (isNumericID(data.searchGroupID) || isNull(data.searchGroupID)) {
				promises.push(updateOneUserSearchGroup(data.id, data.searchGroupID));
			}

			await Promise.all(promises);
			return await getOneUser(data.id);
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};
