/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { makeModifyOneQuery, makeValidateOneQuery } from '~/functions/searches';
import { APIContext } from '~/functions/utils';
import { QueriesService } from './service';

export const createQueriesService = (context: APIContext): QueriesService => ({
	validate: {
		one: makeValidateOneQuery(context),
	},

	modify: {
		one: makeModifyOneQuery(context),
	},
});
