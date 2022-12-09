/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import {
	makeCreateOneMacro,
	makeDeleteOneMacro,
	makeGetAllMacros,
	makeGetMacrosAuthorizedToMe,
	makeGetManyMacros,
	makeGetOneMacro,
	makeUpdateOneMacro,
} from '~/functions/macros';
import { APIContext } from '~/functions/utils';
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
