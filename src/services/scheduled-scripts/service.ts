/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { ScheduledScriptsFilter } from '~/functions/scheduled-tasks';
import { ScheduledTasksFilter } from '~/functions/scheduled-tasks/get-many-scheduled-tasks';
import { CreatableScheduledScript, ScheduledScript, UpdatableScheduledScript } from '~/models/scheduled-task';

export interface ScheduledScriptsService {
	readonly get: {
		readonly one: (scheduledTaskID: string) => Promise<ScheduledScript>;
		readonly many: (filter?: ScheduledScriptsFilter) => Promise<Array<ScheduledScript>>;
		readonly all: () => Promise<Array<ScheduledScript>>;
		readonly authorizedTo: {
			readonly me: () => Promise<Array<ScheduledScript>>;
		};
	};

	readonly create: {
		readonly one: (data: CreatableScheduledScript) => Promise<ScheduledScript>;
		readonly many: (data: Array<CreatableScheduledScript>) => Promise<Array<ScheduledScript>>;
	};

	readonly update: {
		readonly one: (data: UpdatableScheduledScript) => Promise<ScheduledScript>;
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
