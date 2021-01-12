/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableScheduledScript, ScheduledScript } from '../../models';
import { APIFunctionMakerOptions } from '../utils';
import { makeCreateOneScheduledTask } from './create-one-scheduled-task';

export const makeCreateOneScheduledScript = (makerOptions: APIFunctionMakerOptions) => {
	const createOneScheduledTask = makeCreateOneScheduledTask(makerOptions);

	return (authToken: string | null, data: CreatableScheduledScript): Promise<ScheduledScript> => {
		return createOneScheduledTask(authToken, { ...data, type: 'script' });
	};
};
