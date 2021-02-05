/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {
	makeAddOneUserToManyGroups,
	makeCreateOneGroup,
	makeDeleteOneGroup,
	makeGetAllGroups,
	makeGetManyGroups,
	makeGetOneGroup,
	makeRemoveOneUserFromOneGroup,
	makeUpdateOneGroup,
} from '~/functions/groups';
import { APIContext } from '~/functions/utils';
import { NumericID } from '~/value-objects';
import { GroupsService } from './service';

export const createGroupsService = (context: APIContext): GroupsService => ({
	create: {
		one: makeCreateOneGroup(context),
	},

	delete: {
		one: makeDeleteOneGroup(context),
	},

	get: {
		one: makeGetOneGroup(context),
		many: makeGetManyGroups(context),
		all: makeGetAllGroups(context),
	},

	update: {
		one: makeUpdateOneGroup(context),
	},

	addUserTo: {
		one: (userID: NumericID, groupID: NumericID) => makeAddOneUserToManyGroups(context)(userID, [groupID]),
		many: makeAddOneUserToManyGroups(context),
	},

	removeUserFrom: {
		one: makeRemoveOneUserFromOneGroup(context),
	},
});
