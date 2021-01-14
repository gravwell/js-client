/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Macro } from '../../models';
import { isNumericID, NumericID } from '../../value-objects';
import { APIContext } from '../utils';
import { makeGetAllMacros } from './get-all-macros';
import { makeGetMacrosByGroup } from './get-macros-by-group';
import { makeGetMacrosByUser } from './get-macros-by-user';

export const makeGetManyMacros = (context: APIContext) => {
	const getMacrosByUser = makeGetMacrosByUser(context);
	const getMacrosByGroup = makeGetMacrosByGroup(context);
	const getAllMacros = makeGetAllMacros(context);

	return async (authToken: string | null, filter: MacrosFilter = {}): Promise<Array<Macro>> => {
		if (isNumericID(filter.userID) && isNumericID(filter.groupID)) {
			const groupID = filter.groupID;
			const userMacros = await getMacrosByUser(authToken, filter.userID);
			return userMacros.filter(m => m.groupIDs.includes(groupID));
		}

		if (isNumericID(filter.userID)) return getMacrosByUser(authToken, filter.userID);

		if (isNumericID(filter.groupID)) return getMacrosByGroup(authToken, filter.groupID);

		return getAllMacros(authToken);
	};
};

export interface MacrosFilter {
	userID?: NumericID;
	groupID?: NumericID;
}
