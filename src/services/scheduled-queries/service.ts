/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { ScheduledQueriesFilter } from '~/functions/scheduled-tasks';
import { ScheduledTasksFilter } from '~/functions/scheduled-tasks/get-many-scheduled-tasks';
import { CreatableScheduledQuery, ScheduledQuery, UpdatableScheduledQuery } from '~/models/scheduled-task';

export interface ScheduledQueriesService {
	readonly get: {
		readonly one: (scheduledTaskID: string) => Promise<ScheduledQuery>;
		readonly many: (filter?: ScheduledQueriesFilter) => Promise<Array<ScheduledQuery>>;
		readonly all: () => Promise<Array<ScheduledQuery>>;
		readonly authorizedTo: {
			readonly me: () => Promise<Array<ScheduledQuery>>;
		};
	};

	readonly create: {
		readonly one: (data: CreatableScheduledQuery) => Promise<ScheduledQuery>;
		readonly many: (data: Array<CreatableScheduledQuery>) => Promise<Array<ScheduledQuery>>;
	};

	readonly update: {
		readonly one: (data: UpdatableScheduledQuery) => Promise<ScheduledQuery>;
	};

	readonly delete: {
		readonly one: (scheduledTaskID: string) => Promise<void>;
		readonly many: (filter?: ScheduledTasksFilter) => Promise<void>;
		readonly all: () => Promise<void>;
	};

	readonly clear: {
		readonly lastError: (scheduledTaskID: string) => Promise<void>;
		readonly state: (scheduledTaskID: string) => Promise<void>;
	};
}
