/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Group } from '~/models/group/group';
import { isNumericID, NumericID } from '~/value-objects/id';
import { APIContext } from '../utils/api-context';
import { makeGetAllGroups } from './get-all-groups';
import { makeGetGroupsByUser } from './get-groups-by-user';

export const makeGetManyGroups = (
	context: APIContext,
): ((groupFilter?: { userID?: NumericID | undefined }) => Promise<Array<Group>>) => {
	const getGroupsByUser = makeGetGroupsByUser(context);
	const getAllGroups = makeGetAllGroups(context);

	return async (groupFilter: { userID?: NumericID | undefined } = {}): Promise<Array<Group>> => {
		if (isNumericID(groupFilter.userID)) {
			return getGroupsByUser(groupFilter.userID);
		}
		return getAllGroups();
	};
};
