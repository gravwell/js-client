/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeGetOneScriptLibrary, makeSyncAllScriptLibraries } from '~/functions/scripts';
import { APIContext } from '~/functions/utils';
import { ScriptLibrariesService } from './service';

export const createScriptLibrariesService = (context: APIContext): ScriptLibrariesService => ({
	get: {
		one: makeGetOneScriptLibrary(context),
	},

	sync: {
		all: makeSyncAllScriptLibraries(context),
	},
});
