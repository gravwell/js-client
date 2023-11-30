/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeAttachToOneExplorerSearch } from '~/functions/searches/attach-to-one-explorer-search/attach-to-one-explorer-search';
import { makeExploreOneTag } from '~/functions/searches/explore-one-tag/explore-one-tag';
import { makeSubscribeToOneExplorerSearch } from '~/functions/searches/subscribe-to-one-explorer-search/subscribe-to-one-explorer-search';
import { APIContext } from '~/functions/utils/api-context';
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
