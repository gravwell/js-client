/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import {
	makeGetAllPersistentSearchStatus,
	makeGetOnePersistentSearchStatus,
	makeGetPersistentSearchStatusRelatedToMe,
} from '~/functions/searches';
import { APIContext } from '~/functions/utils';
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
