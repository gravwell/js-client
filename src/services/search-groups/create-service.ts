/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { makeGetOneUserSearchGroup } from '../../functions/search-groups/get-one-user-search-group';
import { APIContext } from '../../functions/utils';
import { SearchGroupsService } from './service';

export const createSearchGroupsService = (context: APIContext): SearchGroupsService => ({
	get: {
		one: makeGetOneUserSearchGroup(context),
	},
});
