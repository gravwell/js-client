/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ScheduledScript } from '../../models';
import { APIFunctionMakerOptions } from '../utils';
import { makeGetOneScheduledTask } from './get-one-scheduled-task';

export const makeGetOneScheduledScript = (makerOptions: APIFunctionMakerOptions) => {
	const getOneScheduledTask = makeGetOneScheduledTask(makerOptions);

	return (authToken: string | null, scheduledTaskID: string): Promise<ScheduledScript> => {
		return getOneScheduledTask<'script'>(authToken, scheduledTaskID);
	};
};
