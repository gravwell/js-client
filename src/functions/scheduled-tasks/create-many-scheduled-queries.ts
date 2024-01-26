/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableScheduledQuery } from '~/models/scheduled-task/creatable-scheduled-query';
import { ScheduledQuery } from '~/models/scheduled-task/scheduled-query';
import { APIContext } from '../utils/api-context';
import { makeCreateOneScheduledQuery } from './create-one-scheduled-query';

export const makeCreateManyScheduledQueries = (
	context: APIContext,
): ((data: Array<CreatableScheduledQuery>) => Promise<Array<ScheduledQuery>>) => {
	const createOneScheduledQuery = makeCreateOneScheduledQuery(context);

	return (data: Array<CreatableScheduledQuery>): Promise<Array<ScheduledQuery>> => {
		const createPromises = data.map(_data => createOneScheduledQuery(_data));
		return Promise.all(createPromises);
	};
};
