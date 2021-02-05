/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {
	makeCreateOneSavedQuery,
	makeDeleteOneSavedQuery,
	makeGetAllSavedQueries,
	makeGetOneSavedQuery,
	makeGetSavedQueriesAuthorizedToMe,
	makeUpdateOneSavedQuery,
} from '~/functions/saved-queries';
import { APIContext } from '~/functions/utils';
import { SavedQueriesService } from './service';

export const createSavedQueriesService = (context: APIContext): SavedQueriesService => ({
	get: {
		one: makeGetOneSavedQuery(context),
		all: makeGetAllSavedQueries(context),
		authorizedTo: {
			me: makeGetSavedQueriesAuthorizedToMe(context),
		},
	},

	create: {
		one: makeCreateOneSavedQuery(context),
	},

	update: {
		one: makeUpdateOneSavedQuery(context),
	},

	delete: {
		one: makeDeleteOneSavedQuery(context),
	},
});
