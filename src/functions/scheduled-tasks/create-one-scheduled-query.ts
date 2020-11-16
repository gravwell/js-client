/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ScheduledQuery } from '../../models';
import { APIFunctionMakerOptions } from '../utils';
import { CreatableScheduledQuery, makeCreateOneScheduledTask } from './create-one-scheduled-task';

export const makeCreateOneScheduledQuery = (makerOptions: APIFunctionMakerOptions) => {
	const createOneScheduledTask = makeCreateOneScheduledTask(makerOptions);

	return (authToken: string | null, data: CreatableScheduledQuery): Promise<ScheduledQuery> => {
		return createOneScheduledTask(authToken, { ...data, type: 'query' });
	};
};
