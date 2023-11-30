/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeAddOneUserToManyGroups } from '~/functions/groups/add-one-user-to-many-groups';
import { makeCreateOneGroup } from '~/functions/groups/create-one-group';
import { makeDeleteOneGroup } from '~/functions/groups/delete-one-group';
import { makeGetAllGroups } from '~/functions/groups/get-all-groups';
import { makeGetManyGroups } from '~/functions/groups/get-many-groups';
import { makeGetOneGroup } from '~/functions/groups/get-one-group';
import { makeRemoveOneUserFromOneGroup } from '~/functions/groups/remove-one-user-from-one-group';
import { makeUpdateOneGroup } from '~/functions/groups/update-one-group';
import { APIContext } from '~/functions/utils/api-context';
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
