/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeGetAllPersistentSearchStatus } from '~/functions/searches/get-all-persistent-search-status';
import { makeGetOnePersistentSearchStatus } from '~/functions/searches/get-one-persistent-search-status';
import { makeGetPersistentSearchStatusRelatedToMe } from '~/functions/searches/get-persistent-search-status-related-to-me';
import { APIContext } from '~/functions/utils/api-context';
import { makeGetOnePersistentSearchDetails } from '../../functions/searches/get-one-persistent-search-details';
import { SearchStatusService } from './service';

export const createSearchStatusService = (context: APIContext): SearchStatusService => ({
	get: {
		one: {
			status: makeGetOnePersistentSearchStatus(context),
			details: makeGetOnePersistentSearchDetails(context),
		},
		all: makeGetAllPersistentSearchStatus(context),
		authorizedTo: {
			me: makeGetPersistentSearchStatusRelatedToMe(context),
		},
	},
});
