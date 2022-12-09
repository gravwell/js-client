/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import {
	makeCreateOnePlaybook,
	makeDeleteOnePlaybook,
	makeGetAllPlaybooks,
	makeGetAllPlaybooksRelatedToMe,
	makeGetOnePlaybook,
	makeUpdateOnePlaybook,
} from '~/functions/playbooks';
import { APIContext } from '~/functions/utils';
import { PlaybooksService } from './service';

export const createPlaybooksService = (context: APIContext): PlaybooksService => ({
	get: {
		one: makeGetOnePlaybook(context),
		all: makeGetAllPlaybooks(context),
		authorizedTo: {
			me: makeGetAllPlaybooksRelatedToMe(context),
		},
	},

	create: {
		one: makeCreateOnePlaybook(context),
	},

	update: {
		one: makeUpdateOnePlaybook(context),
	},

	delete: {
		one: makeDeleteOnePlaybook(context),
	},
});
