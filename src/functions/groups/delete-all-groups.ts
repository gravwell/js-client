/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { APIContext } from '../utils';
import { makeDeleteOneGroup } from './delete-one-group';
import { makeGetAllGroups } from './get-all-groups';

export const makeDeleteAllGroups = (context: APIContext) => {
	const deleteOneGroup = makeDeleteOneGroup(context);
	const getAllGroups = makeGetAllGroups(context);

	return async (): Promise<void> => {
		const groups = await getAllGroups();
		const deletePs = groups.map(q => deleteOneGroup(q.id));
		await Promise.all(deletePs);
	};
};
