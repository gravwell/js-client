/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isString, isUndefined } from 'lodash';
import { UpdatableUser } from '~/models/user/updatable-user';
import { User } from '~/models/user/user';
import { APIContext } from '../utils/api-context';
import { makeGetMyUser } from './get-my-user';
import { makeUpdateOneUser } from './update-one-user';

export const makeUpdateMyUser = (context: APIContext): ((data: Omit<UpdatableUser, 'id'>) => Promise<User>) => {
	const getMyUser = makeGetMyUser(context);
	const updateOneUser = makeUpdateOneUser(context);

	return async (data: Omit<UpdatableUser, 'id'>): Promise<User> => {
		try {
			if (isString(data.password) && isUndefined(data.currentPassword)) {
				throw new Error('You must specify your current password to change it');
			}

			const myUser = await getMyUser();
			return updateOneUser({ ...data, id: myUser.id });
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};
