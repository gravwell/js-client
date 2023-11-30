/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeClearOneScheduledQueryError } from '~/functions/scheduled-tasks/clear-one-scheduled-query-error';
import { makeClearOneScheduledQueryState } from '~/functions/scheduled-tasks/clear-one-scheduled-query-state';
import { makeCreateManyScheduledQueries } from '~/functions/scheduled-tasks/create-many-scheduled-queries';
import { makeCreateOneScheduledQuery } from '~/functions/scheduled-tasks/create-one-scheduled-query';
import { makeDeleteAllScheduledQueries } from '~/functions/scheduled-tasks/delete-all-scheduled-queries';
import { makeDeleteManyScheduledQueries } from '~/functions/scheduled-tasks/delete-many-scheduled-queries';
import { makeDeleteOneScheduledQuery } from '~/functions/scheduled-tasks/delete-one-scheduled-query';
import { makeGetAllScheduledQueries } from '~/functions/scheduled-tasks/get-all-scheduled-queries';
import { makeGetManyScheduledQueries } from '~/functions/scheduled-tasks/get-many-scheduled-queries';
import { makeGetOneScheduledQuery } from '~/functions/scheduled-tasks/get-one-scheduled-query';
import { makeGetScheduledQueriesAuthorizedToMe } from '~/functions/scheduled-tasks/get-scheduled-queries-authorized-to-me';
import { makeUpdateOneScheduledQuery } from '~/functions/scheduled-tasks/update-one-scheduled-query';
import { APIContext } from '~/functions/utils/api-context';
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
