/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isString, isUndefined, negate } from 'lodash';
import { isValidUserRole, UpdatableUser } from '../../models';
import { APIFunctionMakerOptions } from '../utils';
import { makeUpdateOneUserInformation } from './update-one-user-information';
import { makeUpdateOneUserLockedState } from './update-one-user-locked-state';
import { makeUpdateOneUserPassword } from './update-one-user-password';
import { makeUpdateOneUserRole } from './update-one-user-role';

export const makeUpdateOneUser = (makerOptions: APIFunctionMakerOptions) => {
	const updateOneUserLockedState = makeUpdateOneUserLockedState(makerOptions);
	const updateOneUserInformation = makeUpdateOneUserInformation(makerOptions);
	const updateOneUserRole = makeUpdateOneUserRole(makerOptions);
	const updateOneUserPassword = makeUpdateOneUserPassword(makerOptions);

	return async (authToken: string | null, data: UpdatableUser): Promise<void> => {
		try {
			const promises: Array<Promise<void>> = [];

			// Update .locked
			if (isBoolean(data.locked)) promises.push(updateOneUserLockedState(authToken, data.id, data.locked));

			// Update .role
			if (isValidUserRole(data.role)) promises.push(updateOneUserRole(authToken, data.id, data.role));

			// Update .username .name or .email
			if ([data.username, data.name, data.email].some(negate(isUndefined)))
				promises.push(updateOneUserInformation(authToken, data));

			// Update password
			if (isString(data.password))
				promises.push(updateOneUserPassword(authToken, data.id, data.password, data.currentPassword));

			await Promise.all(promises);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};
