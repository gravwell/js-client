/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { makeSubscribeToOneExplorerSearch } from '~/functions';
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
});
