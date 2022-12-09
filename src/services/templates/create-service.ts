/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import {
	makeCreateOneTemplate,
	makeDeleteOneTemplate,
	makeGetAllTemplates,
	makeGetAllTemplatesAsAdmin,
	makeGetOneTemplate,
	makeUpdateOneTemplate,
} from '~/functions/templates';
import { APIContext } from '~/functions/utils';
import { TemplatesService } from './service';

export const createTemplatesService = (context: APIContext): TemplatesService => ({
	get: {
		one: makeGetOneTemplate(context),
		all: makeGetAllTemplatesAsAdmin(context),
		authorizedTo: {
			me: makeGetAllTemplates(context),
		},
	},

	create: {
		one: makeCreateOneTemplate(context),
	},

	update: {
		one: makeUpdateOneTemplate(context),
	},

	delete: {
		one: makeDeleteOneTemplate(context),
	},
});
