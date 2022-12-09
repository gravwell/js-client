/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableScheduledQuery, ScheduledQuery } from '~/models';
import { APIContext } from '../utils';
import { makeCreateOneScheduledQuery } from './create-one-scheduled-query';

export const makeCreateManyScheduledQueries = (context: APIContext) => {
	const createOneScheduledQuery = makeCreateOneScheduledQuery(context);

	return (data: Array<CreatableScheduledQuery>): Promise<Array<ScheduledQuery>> => {
		const createPromises = data.map(_data => createOneScheduledQuery(_data));
		return Promise.all(createPromises);
	};
};
