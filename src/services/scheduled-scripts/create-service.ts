/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeClearOneScheduledScriptError } from '~/functions/scheduled-tasks/clear-one-scheduled-script-error';
import { makeClearOneScheduledScriptState } from '~/functions/scheduled-tasks/clear-one-scheduled-script-state';
import { makeCreateManyScheduledScripts } from '~/functions/scheduled-tasks/create-many-scheduled-scripts';
import { makeCreateOneScheduledScript } from '~/functions/scheduled-tasks/create-one-scheduled-script';
import { makeDeleteAllScheduledScripts } from '~/functions/scheduled-tasks/delete-all-scheduled-scripts';
import { makeDeleteManyScheduledScripts } from '~/functions/scheduled-tasks/delete-many-scheduled-scripts';
import { makeDeleteOneScheduledScript } from '~/functions/scheduled-tasks/delete-one-scheduled-script';
import { makeGetAllScheduledScripts } from '~/functions/scheduled-tasks/get-all-scheduled-scripts';
import { makeGetManyScheduledScripts } from '~/functions/scheduled-tasks/get-many-scheduled-scripts';
import { makeGetOneScheduledScript } from '~/functions/scheduled-tasks/get-one-scheduled-script';
import { makeGetScheduledScriptsAuthorizedToMe } from '~/functions/scheduled-tasks/get-scheduled-scripts-authorized-to-me';
import { makeUpdateOneScheduledScript } from '~/functions/scheduled-tasks/update-one-scheduled-script';
import { APIContext } from '~/functions/utils/api-context';
import { ScheduledScriptsService } from './service';

export const createScheduledScriptsService = (context: APIContext): ScheduledScriptsService => ({
	get: {
		one: makeGetOneScheduledScript(context),
		many: makeGetManyScheduledScripts(context),
		all: makeGetAllScheduledScripts(context),
		authorizedTo: {
			me: makeGetScheduledScriptsAuthorizedToMe(context),
		},
	},

	create: {
		one: makeCreateOneScheduledScript(context),
		many: makeCreateManyScheduledScripts(context),
	},

	update: {
		one: makeUpdateOneScheduledScript(context),
	},

	delete: {
		one: makeDeleteOneScheduledScript(context),
		many: makeDeleteManyScheduledScripts(context),
		all: makeDeleteAllScheduledScripts(context),
	},

	clear: {
		lastError: makeClearOneScheduledScriptError(context),
		state: makeClearOneScheduledScriptState(context),
	},
});
