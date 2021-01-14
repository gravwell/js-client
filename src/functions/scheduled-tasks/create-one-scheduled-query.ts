/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableScheduledQuery, ScheduledQuery } from '../../models';
import { APIContext } from '../utils';
import { makeCreateOneScheduledTask } from './create-one-scheduled-task';

export const makeCreateOneScheduledQuery = (context: APIContext) => {
	const createOneScheduledTask = makeCreateOneScheduledTask(context);

	return (authToken: string | null, data: CreatableScheduledQuery): Promise<ScheduledQuery> => {
		return createOneScheduledTask(authToken, { ...data, type: 'query' });
	};
};
