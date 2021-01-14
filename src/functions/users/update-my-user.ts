/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isString, isUndefined } from 'lodash';
import { UpdatableUser } from '../../models';
import { APIContext } from '../utils';
import { makeGetMyUser } from './get-my-user';
import { makeUpdateOneUser } from './update-one-user';

export const makeUpdateMyUser = (context: APIContext) => {
	const getMyUser = makeGetMyUser(context);
	const updateOneUser = makeUpdateOneUser(context);

	return async (data: Omit<UpdatableUser, 'id'>): Promise<void> => {
		try {
			if (isString(data.password) && isUndefined(data.currentPassword))
				throw new Error('You must specify your current password to change it');

			const userID = (await getMyUser()).id;
			return updateOneUser({ ...data, id: userID });
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};
