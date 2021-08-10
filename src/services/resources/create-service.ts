/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {
	makeCreateOneResource,
	makeDeleteOneResource,
	makeGetAllResources,
	makeGetOneResource,
	makeGetResourcesAuthorizedToMe,
	makePreviewOneResourceContent,
	makeUpdateOneResource,
} from '~/functions/resources';
import { APIContext } from '~/functions/utils';
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
