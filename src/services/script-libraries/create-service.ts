/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeGetOneScriptLibrary } from '~/functions/scripts/get-one-script-library';
import { makeSyncAllScriptLibraries } from '~/functions/scripts/sync-all-script-libraries';
import { APIContext } from '~/functions/utils/api-context';
import { ScriptLibrariesService } from './service';

export const createScriptLibrariesService = (context: APIContext): ScriptLibrariesService => ({
	get: {
		one: makeGetOneScriptLibrary(context),
	},

	sync: {
		all: makeSyncAllScriptLibraries(context),
	},
});
