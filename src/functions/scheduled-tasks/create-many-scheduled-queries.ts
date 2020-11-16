/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ScheduledQuery } from '../../models';
import { APIFunctionMakerOptions } from '../utils';
import { makeCreateOneScheduledQuery } from './create-one-scheduled-query';
import { CreatableScheduledQuery } from './create-one-scheduled-task';

export const makeCreateManyScheduledQueries = (makerOptions: APIFunctionMakerOptions) => {
	const createOneScheduledQuery = makeCreateOneScheduledQuery(makerOptions);

	return (authToken: string | null, data: Array<CreatableScheduledQuery>): Promise<Array<ScheduledQuery>> => {
		const createPromises = data.map(_data => createOneScheduledQuery(authToken, _data));
		return Promise.all(createPromises);
	};
};
