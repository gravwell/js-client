/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Group } from '../../models';
import { NumericID, isNumericID } from '../../value-objects';
import { APIFunctionMakerOptions } from '../utils';
import { makeGetAllGroups } from './get-all-groups';
import { makeGetGroupsByUser } from './get-groups-by-user';

export const makeGetManyGroups = (makerOptions: APIFunctionMakerOptions) => {
	const getGroupsByUser = makeGetGroupsByUser(makerOptions);
	const getAllGroups = makeGetAllGroups(makerOptions);

	return async (authToken: string | null, groupFilter: { userID?: NumericID } = {}): Promise<Array<Group>> => {
		if (isNumericID(groupFilter.userID)) return getGroupsByUser(authToken, groupFilter.userID);
		return getAllGroups(authToken);
	};
};
