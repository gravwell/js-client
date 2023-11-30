/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeCreateOneSavedQuery } from '~/functions/saved-queries/create-one-saved-query';
import { makeDeleteOneSavedQuery } from '~/functions/saved-queries/delete-one-saved-query';
import { makeGetAllSavedQueries } from '~/functions/saved-queries/get-all-saved-queries';
import { makeGetOneSavedQuery } from '~/functions/saved-queries/get-one-saved-query';
import { makeGetSavedQueriesAuthorizedToMe } from '~/functions/saved-queries/get-saved-queries-authorized-to-me';
import { makeUpdateOneSavedQuery } from '~/functions/saved-queries/update-one-saved-query';
import { APIContext } from '~/functions/utils/api-context';
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
