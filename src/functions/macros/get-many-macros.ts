/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Macro } from '~/models';
import { isNumericID, NumericID } from '~/value-objects';
import { APIContext } from '../utils';
import { makeGetAllMacros } from './get-all-macros';
import { makeGetMacrosByGroup } from './get-macros-by-group';
import { makeGetMacrosByUser } from './get-macros-by-user';

export const makeGetManyMacros = (context: APIContext): ((filter?: MacrosFilter) => Promise<Array<Macro>>) => {
	const getMacrosByUser = makeGetMacrosByUser(context);
	const getMacrosByGroup = makeGetMacrosByGroup(context);
	const getAllMacros = makeGetAllMacros(context);

	return async (filter: MacrosFilter = {}): Promise<Array<Macro>> => {
		if (isNumericID(filter.userID) && isNumericID(filter.groupID)) {
			const groupID = filter.groupID;
			const userMacros = await getMacrosByUser(filter.userID);
			return userMacros.filter(m => m.groupIDs.includes(groupID));
		}

		if (isNumericID(filter.userID)) {
			return getMacrosByUser(filter.userID);
		}

		if (isNumericID(filter.groupID)) {
			return getMacrosByGroup(filter.groupID);
		}

		return getAllMacros();
	};
};

export interface MacrosFilter {
	userID?: NumericID;
	groupID?: NumericID;
}
