/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeGetAllIndexers } from '~/functions/indexers/get-all-indexers';
import { makeRestartIndexers } from '~/functions/indexers/restart-indexers';
import { APIContext } from '~/functions/utils/api-context';
import { IndexersService } from './service';

export const createIndexersService = (context: APIContext): IndexersService => ({
	restart: makeRestartIndexers(context),
	get: {
		all: makeGetAllIndexers(context),
	},
});
