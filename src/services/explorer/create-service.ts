/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { makeAttachToOneExplorerSearch, makeSubscribeToOneExplorerSearch } from '~/functions/searches';
import { makeExploreOneTag } from '~/functions/searches/explore-one-tag';
import { APIContext } from '~/functions/utils';
import { ExplorerService } from './service';

export const createExplorerService = (context: APIContext): ExplorerService => ({
	explore: {
		one: makeExploreOneTag(context),
	},

	searchAndExplore: {
		one: makeSubscribeToOneExplorerSearch(context),
	},

	get: {
		one: makeAttachToOneExplorerSearch(context),
	},
});
