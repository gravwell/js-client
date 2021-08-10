/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {
	makeBackgroundOneSearch,
	makeDeleteOneSearch,
	makeDownloadOneSearch,
	makeSaveOneSearch,
	makeSubscribeToOneSearch,
} from '~/functions/searches';
import { makeStopOneSearch } from '~/functions/searches/stop one-search';
import { APIContext } from '~/functions/utils';
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

	create: {
		one: makeSubscribeToOneSearch(context),
	},

	stop: {
		one: makeStopOneSearch(context),
	},
});
