/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeAttachToOneSearch } from '~/functions/searches/attach-to-one-search/attach-to-one-search';
import { makeBackgroundOneSearch } from '~/functions/searches/background-one-search';
import { makeDeleteOneSearch } from '~/functions/searches/delete-one-search';
import { makeDownloadOneSearch } from '~/functions/searches/download-one-search';
import { makeSaveOneSearch } from '~/functions/searches/save-one-search';
import { makeStopOneSearch } from '~/functions/searches/stop-one-search';
import { makeSubscribeToOneSearch } from '~/functions/searches/subscribe-to-one-search/subscribe-to-one-search';
import { makeUpdateOneSearchDetail } from '~/functions/searches/update-one-search-detail';
import { APIContext } from '~/functions/utils/api-context';
import { SearchesService } from './service';

export const createSearchesService = (context: APIContext): SearchesService => ({
	background: {
		one: makeBackgroundOneSearch(context),
	},

	save: {
		one: makeSaveOneSearch(context),
	},

	delete: {
		one: makeDeleteOneSearch(context),
	},

	download: {
		one: makeDownloadOneSearch(context),
	},

	get: {
		one: makeAttachToOneSearch(context),
	},

	create: {
		one: makeSubscribeToOneSearch(context),
	},

	stop: {
		one: makeStopOneSearch(context),
	},

	update: {
		one: makeUpdateOneSearchDetail(context),
	},
});
