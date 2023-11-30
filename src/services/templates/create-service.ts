/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeCreateOneTemplate } from '~/functions/templates/create-one-template';
import { makeDeleteOneTemplate } from '~/functions/templates/delete-one-template';
import { makeGetAllTemplates } from '~/functions/templates/get-all-templates';
import { makeGetAllTemplatesAsAdmin } from '~/functions/templates/get-all-templates-as-admin';
import { makeGetOneTemplate } from '~/functions/templates/get-one-template';
import { makeUpdateOneTemplate } from '~/functions/templates/update-one-template';
import { APIContext } from '~/functions/utils/api-context';
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
