/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import {
	makeClearOneScheduledQueryError,
	makeClearOneScheduledQueryState,
	makeCreateManyScheduledQueries,
	makeCreateOneScheduledQuery,
	makeDeleteAllScheduledQueries,
	makeDeleteManyScheduledQueries,
	makeDeleteOneScheduledQuery,
	makeGetAllScheduledQueries,
	makeGetManyScheduledQueries,
	makeGetOneScheduledQuery,
	makeGetScheduledQueriesAuthorizedToMe,
	makeUpdateOneScheduledQuery,
} from '~/functions/scheduled-tasks';
import { APIContext } from '~/functions/utils';
import { ScheduledQueriesService } from './service';

export const createScheduledQueriesService = (context: APIContext): ScheduledQueriesService => ({
	get: {
		one: makeGetOneScheduledQuery(context),
		many: makeGetManyScheduledQueries(context),
		all: makeGetAllScheduledQueries(context),
		authorizedTo: {
			me: makeGetScheduledQueriesAuthorizedToMe(context),
		},
	},

	create: {
		one: makeCreateOneScheduledQuery(context),
		many: makeCreateManyScheduledQueries(context),
	},

	update: {
		one: makeUpdateOneScheduledQuery(context),
	},

	delete: {
		one: makeDeleteOneScheduledQuery(context),
		many: makeDeleteManyScheduledQueries(context),
		all: makeDeleteAllScheduledQueries(context),
	},

	clear: {
		lastError: makeClearOneScheduledQueryError(context),
		state: makeClearOneScheduledQueryState(context),
	},
});
