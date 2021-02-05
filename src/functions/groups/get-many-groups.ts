/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Group } from '~/models';
import { isNumericID, NumericID } from '../../value-objects';
import { APIContext } from '../utils';
import { makeGetAllGroups } from './get-all-groups';
import { makeGetGroupsByUser } from './get-groups-by-user';

export const makeGetManyGroups = (context: APIContext) => {
	const getGroupsByUser = makeGetGroupsByUser(context);
	const getAllGroups = makeGetAllGroups(context);

	return async (groupFilter: { userID?: NumericID } = {}): Promise<Array<Group>> => {
		if (isNumericID(groupFilter.userID)) return getGroupsByUser(groupFilter.userID);
		return getAllGroups();
	};
};
