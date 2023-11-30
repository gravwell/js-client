/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeCreateOneResource } from '~/functions/resources/create-one-resource';
import { makeDeleteOneResource } from '~/functions/resources/delete-one-resource';
import { makeGetAllResources } from '~/functions/resources/get-all-resources';
import { makeGetOneResource } from '~/functions/resources/get-one-resource';
import { makeGetResourcesAuthorizedToMe } from '~/functions/resources/get-resources-authorized-to-me';
import { makePreviewOneResourceContent } from '~/functions/resources/preview-one-resource-content';
import { makeUpdateOneResource } from '~/functions/resources/update-one-resource';
import { APIContext } from '~/functions/utils/api-context';
import { ResourcesService } from './service';

export const createResourcesService = (context: APIContext): ResourcesService => ({
	get: {
		one: makeGetOneResource(context),
		all: makeGetAllResources(context),
		authorizedTo: {
			me: makeGetResourcesAuthorizedToMe(context),
		},
	},

	preview: {
		one: makePreviewOneResourceContent(context),
	},

	create: {
		one: makeCreateOneResource(context),
	},

	update: {
		one: makeUpdateOneResource(context),
	},

	delete: {
		one: makeDeleteOneResource(context),
	},
});
