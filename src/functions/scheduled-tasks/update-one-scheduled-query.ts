/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ScheduledQuery, UpdatableScheduledQuery } from '../../models';
import { APIFunctionMakerOptions } from '../utils';
import { makeUpdateOneScheduledTask } from './update-one-scheduled-task';

export const makeUpdateOneScheduledQuery = (makerOptions: APIFunctionMakerOptions) => {
	const updateOneScheduleTask = makeUpdateOneScheduledTask(makerOptions);

	return (authToken: string | null, data: UpdatableScheduledQuery): Promise<ScheduledQuery> => {
		return updateOneScheduleTask(authToken, { ...data, type: 'query' });
	};
};
