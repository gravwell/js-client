/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ScheduledQuery } from '../../models';
import { APIContext } from '../utils';
import { makeGetOneScheduledTask } from './get-one-scheduled-task';

export const makeGetOneScheduledQuery = (context: APIContext) => {
	const getOneScheduledTask = makeGetOneScheduledTask(context);

	return (scheduledTaskID: string): Promise<ScheduledQuery> => {
		return getOneScheduledTask<'query'>(scheduledTaskID);
	};
};
