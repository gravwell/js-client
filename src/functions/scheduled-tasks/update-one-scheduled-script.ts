/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ScheduledScript, UpdatableScheduledQuery } from '../../models';
import { APIContext } from '../utils';
import { makeUpdateOneScheduledTask } from './update-one-scheduled-task';

export const makeUpdateOneScheduledScript = (context: APIContext) => {
	const updateOneScheduleTask = makeUpdateOneScheduledTask(context);

	return (authToken: string | null, data: UpdatableScheduledQuery): Promise<ScheduledScript> => {
		return updateOneScheduleTask(authToken, { ...data, type: 'script' });
	};
};
