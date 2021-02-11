/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { APIContext } from '~/functions/utils';
import { ElementFilter, Query } from '~/models';

export const makeModifyOneQuery = (context: APIContext) => {
	return async (query: Query, modifier: ElementFilter): Promise<Query> => {
		return {} as any;
	};
};
