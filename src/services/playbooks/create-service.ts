/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeCreateOnePlaybook } from '~/functions/playbooks/create-one-playbook';
import { makeDeleteOnePlaybook } from '~/functions/playbooks/delete-one-playbook';
import { makeGetAllPlaybooks } from '~/functions/playbooks/get-all-playbooks';
import { makeGetAllPlaybooksRelatedToMe } from '~/functions/playbooks/get-all-playbooks-related-to-me';
import { makeGetOnePlaybook } from '~/functions/playbooks/get-one-playbook';
import { makeUpdateOnePlaybook } from '~/functions/playbooks/update-one-playbook';
import { APIContext } from '~/functions/utils/api-context';
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
