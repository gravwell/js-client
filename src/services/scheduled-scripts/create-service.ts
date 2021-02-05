/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {
	makeClearOneScheduledScriptError,
	makeClearOneScheduledScriptState,
	makeCreateManyScheduledScripts,
	makeCreateOneScheduledScript,
	makeDeleteAllScheduledScripts,
	makeDeleteManyScheduledScripts,
	makeDeleteOneScheduledScript,
	makeGetAllScheduledScripts,
	makeGetManyScheduledScripts,
	makeGetOneScheduledScript,
	makeGetScheduledScriptsAuthorizedToMe,
	makeUpdateOneScheduledScript,
} from '~/functions/scheduled-tasks';
import { APIContext } from '~/functions/utils';
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
