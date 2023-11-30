/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeCreateOneMacro } from '~/functions/macros/create-one-macro';
import { makeDeleteOneMacro } from '~/functions/macros/delete-one-macro';
import { makeGetAllMacros } from '~/functions/macros/get-all-macros';
import { makeGetMacrosAuthorizedToMe } from '~/functions/macros/get-macros-authorized-to-me';
import { makeGetManyMacros } from '~/functions/macros/get-many-macros';
import { makeGetOneMacro } from '~/functions/macros/get-one-macro';
import { makeUpdateOneMacro } from '~/functions/macros/update-one-macro';
import { APIContext } from '~/functions/utils/api-context';
import { MacrosService } from './service';

export const createMacrosService = (context: APIContext): MacrosService => ({
	get: {
		one: makeGetOneMacro(context),
		many: makeGetManyMacros(context),
		all: makeGetAllMacros(context),
		authorizedTo: {
			me: makeGetMacrosAuthorizedToMe(context),
		},
	},

	create: {
		one: makeCreateOneMacro(context),
	},

	update: {
		one: makeUpdateOneMacro(context),
	},

	delete: {
		one: makeDeleteOneMacro(context),
	},
});
